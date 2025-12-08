import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ORVIA_SYSTEM_PROMPT } from "@/lib/orvia-config";
import nodemailer from "nodemailer";
import {
  getClientIP,
  checkRateLimit,
  cleanupRateLimit,
  validateMessage,
  sanitizeMessageHistory,
  sanitizeOutput,
  createSecureSystemPrompt,
} from "@/lib/orvia-security";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const phoneRegex = /(\+?\d[\d\s().-]{6,}\d)/g;

// Cleanup rate limit map periodically (runs on each request check)
// For production, consider using Redis or a persistent store

async function sendLeadNotification({
  email,
  phone,
  latestMessage,
  history,
}: {
  email?: string;
  phone?: string;
  latestMessage: string;
  history: ChatMessage[];
}) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Skipping lead notification: SMTP env vars missing.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const toAddress = process.env.LEAD_INBOX ?? process.env.CONTACT_TO ?? process.env.SMTP_USER;
  const fromAddress =
    process.env.CONTACT_FROM ?? `"Orvia Assistant" <${process.env.SMTP_USER as string}>`;

  const transcript = history
    .map((msg) => `${msg.role === "user" ? "Prospect" : "Orvia"}: ${msg.content}`)
    .join("\n");

  await transporter.sendMail({
    from: fromAddress,
    to: toAddress,
    subject: `New Orvia lead${email ? ` - ${email}` : ""}`,
    text: `A new prospect shared contact details via Orvia.

Email: ${email ?? "Not provided"}
Phone: ${phone ?? "Not provided"}

Latest message:
${latestMessage}

Conversation transcript:
${transcript}
`,
  });
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY env variable." },
        { status: 500 },
      );
    }

    // Cleanup old rate limit records periodically
    cleanupRateLimit();

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Too many requests. Please slow down and try again in a moment.",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(rateLimit.resetAt).toISOString(),
          },
        },
      );
    }

    const body = await request.json();
    const rawMessages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];

    // Validate and sanitize message history
    const sanitizedMessages = sanitizeMessageHistory(rawMessages);

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "No valid messages provided." },
        { status: 400 },
      );
    }

    // Validate the latest user message specifically
    const lastUserMessage = sanitizedMessages.filter((m) => m.role === "user").pop();
    if (lastUserMessage) {
      const validation = validateMessage(lastUserMessage.content);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error || "Invalid message format." },
          { status: 400 },
        );
      }
    }

    // Create secure system prompt
    const secureSystemPrompt = createSecureSystemPrompt(ORVIA_SYSTEM_PROMPT);

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system" as const, content: secureSystemPrompt },
        ...sanitizedMessages.slice(-10).map((message) => ({
          role: message.role as "user" | "assistant",
          content: message.content,
        })),
      ],
      temperature: 0.6,
    });

    const outputTextArray =
      typeof response.output_text === "string"
        ? [response.output_text]
        : Array.isArray(response.output_text)
          ? response.output_text
          : [];

    const rawReply =
      (outputTextArray.filter(Boolean).join("\n")) ||
      (Array.isArray(response.output)
        ? (response.output as Array<{ content?: Array<{ text?: string } | Record<string, unknown>> | null }>)
            .flatMap((block) =>
              Array.isArray(block?.content)
                ? block.content
                    .map((chunk) =>
                      chunk && typeof chunk === "object" && "text" in chunk ? (chunk as { text?: string }).text ?? "" : "",
                    )
                    .filter(Boolean)
                : [],
            )
            .join("\n")
        : "") ||
      "I'm sorry, I didn't catch that. Could you please repeat?";

    // Sanitize output to prevent XSS (though React escapes by default, extra safety)
    const reply = sanitizeOutput(rawReply);

    // Extract contact information from sanitized messages (using already found lastUserMessage)
    if (lastUserMessage) {
      const foundEmails = lastUserMessage.content.match(emailRegex) ?? undefined;
      const foundPhones = lastUserMessage.content.match(phoneRegex) ?? undefined;
      if (foundEmails?.length || foundPhones?.length) {
        sendLeadNotification({
          email: foundEmails?.[0],
          phone: foundPhones?.[0],
          latestMessage: lastUserMessage.content,
          history: sanitizedMessages as ChatMessage[],
        }).catch((error) => console.error("[orvia-lead-email]", error));
      }
    }

    return NextResponse.json(
      { reply },
      {
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimit.resetAt).toISOString(),
        },
      },
    );
  } catch (error) {
    // Don't expose internal error details to clients
    console.error("[orvia-chat-error]", error instanceof Error ? error.message : "Unknown error");
    
    // Check if it's a validation error
    if (error instanceof Error && error.message.includes("Invalid")) {
      return NextResponse.json(
        { error: "Invalid request. Please check your message and try again." },
        { status: 400 },
      );
    }
    
    return NextResponse.json(
      { error: "Unable to reach Orvia right now. Please try again in a moment." },
      { status: 500 },
    );
  }
}
