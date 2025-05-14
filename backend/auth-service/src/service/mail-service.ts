import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { OptionsMessages } from "../utils/text-message";
import { logger } from "../utils/logger";

class MailService {
  transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    } as SMTPTransport.Options);
  }
  async sendActivationMail(toEmail: string, link: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: toEmail,
        subject: `${OptionsMessages.ACTIVATE_MAIL} - ${process.env.API_URL}`,
        text: "",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; margin: 0;">
              <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #4a90e2; color: #ffffff; padding: 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${OptionsMessages.MESSAGE_EMAIL}</h1>
                </div>
                <div style="padding: 20px; text-align: center;">
                  <p style="color: #666; font-size: 16px; margin: 0 0 20px;">Нажмите кнопку ниже, чтобы активировать ваш аккаунт:</p>
                  <a href="${link}" style="display: inline-block; background-color: #4a90e2; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500;">Активировать</a>
                </div>
                <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #999;">
                  <p style="margin: 0;">Если кнопка не работает, используйте ссылку: <br><a href="${link}" style="color: #4a90e2;">${link}</a></p>
                </div>
              </div>
            </div>
          `,
      });
    } catch (e) {
      console.log(this.transporter);
      logger.error("Send Activation Mail:", e);
    }
  }
}

export default new MailService();
