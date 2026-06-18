import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const getSecret = () =>
  process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';

export const generateVerificationToken = (userId: string): string =>
  jwt.sign({ userId }, getSecret(), { expiresIn: '24h' });

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, getSecret()) as { userId: string };
  } catch {
    return null;
  }
};

export const sendVerificationEmail = async (
  email: string,
  userId: string
): Promise<void> => {
  const token = generateVerificationToken(userId);
  const confirmUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/confirm/${token}`;
  const from =
    process.env.EMAIL_FROM || '"Noema Forum" <noreply@noema-forum.dev>';
  const subject = 'Confirm your Noema Forum registration';
  const html = `<p>Click <a href="${confirmUrl}">here</a> to confirm your email address. This link expires in 24 hours.</p>`;

  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: email, subject, html }),
    });

    if (!response.ok) {
      throw new Error(
        `Resend API error (${response.status}): ${await response.text()}`
      );
    }
    return;
  }

  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({ from, to: email, subject, html });
  console.log(
    'Verification email preview URL:',
    nodemailer.getTestMessageUrl(info)
  );
};
