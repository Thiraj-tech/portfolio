import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "10kb" }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

app.post("/contact", limiter, async (req, res) => {
  const { name, email, message, company } = req.body ?? {};

  // Honeypot — a hidden field real visitors never fill in. Bots that fill
  // every field trip this and get a fake success instead of a real send.
  if (typeof company === "string" && company.trim().length > 0) {
    return res.status(200).json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 200 ||
    !isValidEmail(email.trim()) ||
    message.trim().length < 10 ||
    message.trim().length > 5000
  ) {
    return res.status(400).json({ ok: false, error: "Invalid submission." });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      replyTo: email.trim(),
      subject: `New message from ${name.trim()}`,
      text: `From: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    res.status(502).json({ ok: false, error: "Failed to send message." });
  }
});

app.get("/health", (_req, res) => res.status(200).send("ok"));

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`Contact API listening on port ${port}`);
});
