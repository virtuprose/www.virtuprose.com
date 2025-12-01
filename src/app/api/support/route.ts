import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({ error: "Email configuration missing." }, { status: 500 });
    }

    const body = await request.json();
    const { name, email, subject, message } = body ?? {};
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
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

    const toAddress = process.env.SUPPORT_INBOX ?? "support@virtuprose.com";
    const fromAddress = process.env.CONTACT_FROM ?? `"VirtuProse Support" <${process.env.SMTP_USER as string}>`;

    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      subject: `Support request from ${name}${subject ? ` – ${subject}` : ""}`,
      text: `Name: ${name}
Email: ${email}
Subject: ${subject ?? "Not provided"}

Message:
${message}`,
    });

    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "We received your support request",
      text: `Hi ${name},

Thanks for reaching out to VirtuProse. Our support team has received your message and will get back to you within 24 hours.

If your request is urgent, reply to this email and include URGENT in the subject line.

— VirtuProse Support`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[support-form]", error);
    return NextResponse.json({ error: "Unable to send your request. Please email support@virtuprose.com." }, { status: 500 });
  }
}
