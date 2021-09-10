import { config } from "dotenv";
config();
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EVENT_TYPES } from "./types";
/**
 * Sender and recipients email addresses and their names
 */
export const EMAIL_USERS = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    cc: process.env.EMAIL_CC,
    bcc: process.env.EMAIL_BCC,
};

export const DONT_CC = {
    [EVENT_TYPES.ANNIVERSARY]: process.env.DONT_CC_HAPPY_ANNIVERSARY,
    [EVENT_TYPES.GIFT_SELECTION_ANNIVERSARY]:
        process.env.DONT_CC_GIFT_SELECTION_ANNIVERSARY,
    [EVENT_TYPES.BIRTHDAY]: process.env.DONT_CC_HAPPY_BIRTHDAY,
    [EVENT_TYPES.GIFT_SELECTION_BIRTHDAY]:
        process.env.DONT_CC_GIFT_SELECTION_BIRTHDAY,
};

export const ALLOWED_EVENTS = {
    [EVENT_TYPES.ANNIVERSARY]: !!(process.env.ALLOW_HAPPY_ANNIVERSARY || false),
    [EVENT_TYPES.BIRTHDAY]: !!(process.env.ALLOW_HAPPY_BIRTHDAY || false),
    [EVENT_TYPES.GIFT_SELECTION_ANNIVERSARY]: !!(
        process.env.ALLOW_GIFT_SELECTION_FOR_ANNIVERSARY || false
    ),
    [EVENT_TYPES.GIFT_SELECTION_BIRTHDAY]: !!(
        process.env.ALLOW_GIFT_SELECTION_FOR_BIRTHDAY || false
    ),
};

export const GOOGLE = {
    BUCKET_NAME: process.env.GOOGLE_BUCKET_NAME || undefined,
    PROJECT_ID: process.env.GOOGLE_PROJECT_ID || undefined,
    KEY_FILE_PATH: process.env.GOOGLE_KEY_FILE_PATH || undefined,
};
export const GIFT_SELECTION_FORM_LINK = process.env.GIFT_SELECTION_FORM_LINK;
/**
 * SMTP Credentials
 */
export const SMTP_CREDENTIALS:
    | SMTPTransport
    | SMTPTransport.Options
    | string = {
    host: process.env.SMTP_HOST,
    port: +(process.env.SMTP_PORT || 465),
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
