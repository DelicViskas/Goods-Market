import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD
  }
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?email=${email}&token=${token}`;
  await transporter.sendMail({
    from: `"Goods Market" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'Подтверждение почты',
    html: `
      <p>Спасибо за регистрацию!</p>
      <p>Нажмите на ссылку ниже, чтобы подтвердить почту:</p>
      <a href="${verificationUrl}">Подтвердить</a>
    `
  });
}