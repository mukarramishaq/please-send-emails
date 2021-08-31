import { config } from "dotenv";
config();
import SMTPTransport from "nodemailer/lib/smtp-transport";
/**
 * Sender and recipients email addresses and their names
 */
export const EMAIL_USERS = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    cc: process.env.EMAIL_CC,
    bcc: process.env.EMAIL_BCC,
};

export const GOOGLE_BUCKET_NAME = process.env.GOOGLE_BUCKET_NAME;
export const GIFT_SELECTION_FORM_LINK = process.env.GIFT_SELECTION_FORM_LINK;
/**
 * SMTP Credentials
 */
export const SMTP_CREDENTIALS:
    | SMTPTransport
    | SMTPTransport.Options
    | string = {
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
        type: process.env.SMTP_AUTH_TYPE as any,
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_LOGIN_PASS,
        method: process.env.SMTP_AUTH_CUSTOM_METHOD,
        clientId: process.env.SMTP_AUTH_OAUTH2_CLIENT_ID,
        clientSecret: process.env.SMTP_AUTH_OAUTH2_CLIENT_SECRET,
        refreshToken: process.env.SMTP_AUTH_OAUTH2_REFRESH_TOKEN,
    },
    tls: {
        rejectUnauthorized: false,
    },
};
