import nodemailer from 'nodemailer';

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASS;

const transporter =
  user && pass
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      })
    : null;

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!transporter || !user) {
    console.log('Email skipped because SMTP is not configured.');
    console.log({ to, subject });
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `Remindly <${user}>`,
    to,
    subject,
    html
  });
}
