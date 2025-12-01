import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

function missingEnvVars(): string[] {
  return requiredEnv.filter((key) => !process.env[key]);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const project = String(formData.get("project") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const source = String(formData.get("source") ?? "Website form");
    const website = String(formData.get("website") ?? "").trim();
    const mobile = String(formData.get("mobile") ?? "").trim();
    const budget = String(formData.get("budget") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();

    if (!name || !email) {
      throw new Error("Missing required fields");
    }

    const missing = missingEnvVars();
    if (missing.length) {
      throw new Error(
        `Missing SMTP configuration: ${missing
          .map((key) => `process.env.${key}`)
          .join(", ")}`
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from:
        process.env.CONTACT_FROM ??
        `"VirtuProse Site" <${process.env.SMTP_USER as string}>`,
      to: process.env.CONTACT_TO ?? "info@virtuprose.com",
      subject: `New ${project || "project"} inquiry from ${name}`,
      replyTo: email,
      text: `Source: ${source}
Name: ${name}
Email: ${email}
Project: ${project}
Website: ${website}
Mobile: ${mobile}
Budget: ${budget}
Country: ${country}

Message:
${message}`,
      html: `
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project:</strong> ${project}</p>
        ${website ? `<p><strong>Website:</strong> ${website}</p>` : ""}
        ${mobile ? `<p><strong>Mobile:</strong> ${mobile}</p>` : ""}
        ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ""}
        ${country ? `<p><strong>Country:</strong> ${country}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    await transporter.sendMail({
      from:
        process.env.CONTACT_FROM ??
        `"VirtuProse Site" <${process.env.SMTP_USER as string}>`,
      to: email,
      subject: "We received your message",
      html: `
        <p>Hi ${name.split(" ")[0] || "there"},</p>
        <p>Thanks for reaching out to VirtuProse Solutions. Our team has received your request and will respond within 12 hours.</p>
        <p>In the meantime, feel free to share any additional context by replying to this email.</p>
        <p>— VirtuProse Solutions</p>
      `,
    });

    const redirectUrl = new URL("/contact?status=success", request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("[contact:POST]", error);
    const redirectUrl = new URL("/contact?status=error", request.url);
    return NextResponse.redirect(redirectUrl);
  }
}
