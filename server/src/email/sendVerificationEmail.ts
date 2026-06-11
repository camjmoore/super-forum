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

  let transporter: nodemailer.Transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: parseInt(process.env.SMTP_PORT || '465') === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Super Forum" <noreply@super-forum.dev>',
    to: email,
    subject: 'Confirm your Super Forum registration',
    html: `<p>Click <a href="${confirmUrl}">here</a> to confirm your email address. This link expires in 24 hours.</p>`,
  });

  if (!process.env.SMTP_HOST) {
    console.log('Verification email preview URL:', nodemailer.getTestMessageUrl(info));
  }
};
