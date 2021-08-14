import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * creates a transporter according to params.
 * through this transporter, we can send emails
 * @param smptCredentials 
 */
export const pleaseCreateTransport = (smptCredentials: SMTPTransport | SMTPTransport.Options | string) => {
    return createTransport(smptCredentials);
}
