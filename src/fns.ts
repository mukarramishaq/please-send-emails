import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EVENT_TYPES, TemplateRegistry, UserCsvRow } from "./types";
import * as hbs from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { SMTP_CREDENTIALS, EMAIL_USERS } from "./env";
import { getMonth, getDate, format as formatDate } from "date-fns";
import { REGISTERED_EMAIL_TEMPLATES } from "./emailTemplatesRegister";
import { createLogger, format, transports } from "winston";

const { timestamp, label, prettyPrint } = format;

export const pleaseSendEmailsIfPending = async (user: UserCsvRow) => {
    const pendings = whatEmailsArePending(user);
    return await Promise.all(
        pendings.map(async (template) => {
            const sentMsg = await pleaseSendEmail(user, template);
            return {
                sentMsg,
                template,
            };
        })
    );
};

/**
 * this will tell what type of emails are pending
 * for this user for today
 * @param user
 */
export const whatEmailsArePending = (user: UserCsvRow) => {
    const birthDate = new Date(user.birth_date);
    const anniversaryDate = new Date(user.joining_date);
    const pendingEmails: TemplateRegistry[] = [];
    if (isThisToday(birthDate)) {
        pendingEmails.push(
            REGISTERED_EMAIL_TEMPLATES.filter(
                (t) => t.id === EVENT_TYPES.BIRTHDAY
            ).pop()
        );
    }
    if (isThisToday(anniversaryDate)) {
        pendingEmails.push(
            REGISTERED_EMAIL_TEMPLATES.filter(
                (t) => t.id === EVENT_TYPES.ANNIVERSARY
            ).pop()
        );
    }
    return pendingEmails;
};

/**
 * this tells whether a specific event id due today
 * @param date
 */
export const isThisToday = (date: Date) => {
    const today = new Date();
    return (
        getMonth(today) === getMonth(date) && getDate(today) === getDate(date)
    );
};

/**
 * this will send an email to user with the specified template
 * @param user
 * @param template
 */
export const pleaseSendEmail = async (
    user: UserCsvRow,
    template: TemplateRegistry
) => {
    const tranporter = pleaseCreateTransport(SMTP_CREDENTIALS);
    const context = pleaseGetTemplateContext(template, user);
    const subject = pleaseCompileTemplate(template.subject, context);
    const htmlBody = await pleaseCompileRegisteredTemplate(template, context);
    return tranporter.sendMail({
        ...EMAIL_USERS,
        to: `${user.name} <${user.email}>`,
        subject,
        html: htmlBody,
        attachments: template.attachments,
    });
};

/**
 * this retreive a context object. all the attributes
 * of this context are, might be, being used in the template
 * @param template
 * @param user
 */
export const pleaseGetTemplateContext = (
    template: TemplateRegistry,
    user: UserCsvRow
) => {
    const attachments = [...template.attachments];
    const imageUrl = "cid:" + (attachments.pop()?.cid || "");
    const data = {
        userName: user.name,
        imageUrl,
    };
    if (template.id === EVENT_TYPES.BIRTHDAY) {
        // add other data values to data object
        // which are used in this template
    } else if (template.id === EVENT_TYPES.ANNIVERSARY) {
        // add other data values to data object
        // which are used in this template
    }
    return data;
};

/**
 * creates a transporter according to params.
 * through this transporter, we can send emails
 * @param smptCredentials
 */
export const pleaseCreateTransport = (
    smptCredentials: SMTPTransport | SMTPTransport.Options | string
) => {
    return createTransport(smptCredentials);
};

/**
 * parses the hbs template and fill the variables with data
 * and return html in string
 * @param template an object of TemplateRegistry
 * @param context any
 */
export const pleaseCompileRegisteredTemplate = async (
    template: TemplateRegistry,
    context: any
) => {
    const fileContents: string = await new Promise((resolve, reject) => {
        fs.readFile(
            path.resolve(
                __dirname,
                "assets",
                "email-templates",
                `${template.id}.html`
            ),
            (error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data.toString());
            }
        );
    });
    const compiledTemplate = hbs.compile(fileContents);
    const html = compiledTemplate(context);
    console.log(html, context);
    return html;
};

/**
 * compiles a simple hbs string
 * @param template
 * @param context
 */
export const pleaseCompileTemplate = (template: string, context: any) => {
    return hbs.compile(template)(context);
};

export const sentEmailsLogger = createLogger({
    format: format.combine(
        format.label({ label: "Emails" }),
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.Console({
            handleExceptions: true,
        }),
        new transports.File({
            filename: `logs/sent_emails_${formatDate(
                new Date(),
                "yyyy-MM-dd"
            )}.log`,
            handleExceptions: true,
        }),
    ],
});
