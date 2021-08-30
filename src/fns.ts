import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {
    ALLOWED_GIFTED_ANNIVERSARIES,
    EVENT_TYPES,
    SEND_GIFT_SELECTION_EMAIL_BEFORE,
    TemplateRegistry,
    UserCsvRow,
} from "./types";
import * as hbs from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { SMTP_CREDENTIALS, EMAIL_USERS } from "./env";
import {
    getMonth,
    getDate,
    format as formatDate,
    differenceInYears,
    subDays,
} from "date-fns";
import { REGISTERED_EMAIL_TEMPLATES } from "./emailTemplatesRegister";
import { createLogger, format, transports } from "winston";
import { pleaseGetContext } from "./context";

const { timestamp, prettyPrint } = format;

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
    /**
     * all the functions in shallIs array are there
     * to determine whether an email is pending
     * for a specific event for this user
     */
    const shallIs = [
        shallISendForAnniversary,
        shallISendForAnniversaryGiftSelection,
        shallISendForBirthday,
        shallISendForBirthdayGiftSelection,
    ];
    const pendingEmails = shallIs.reduce((pendings, shallI) => {
        const event = shallI(user);
        if (event) {
            pendings.push(
                REGISTERED_EMAIL_TEMPLATES.filter((t) => t.id === event).pop()
            );
        }
        return pendings;
    }, [] as TemplateRegistry[]);
    return pendingEmails;
};

/**
 * this function tells whether a birthday is today AND
 * are we really need to send an email for this one or not
 * @param date
 */
export const shallISendForBirthday = (user: UserCsvRow) => {
    const date = new Date(user.birth_date);
    const today = new Date();
    return (
        getMonth(today) === getMonth(date) &&
        getDate(today) === getDate(date) &&
        EVENT_TYPES.BIRTHDAY
    );
};

/**
 * this function tells whether a birthday is today AND
 * are we really need to send an email for this one or not
 * @param date
 */
export const shallISendForBirthdayGiftSelection = (user: UserCsvRow) => {
    const date = new Date(user.birth_date);
    const dueDate = subDays(date, SEND_GIFT_SELECTION_EMAIL_BEFORE); // before how many days
    const today = new Date();
    return (
        getMonth(today) === getMonth(dueDate) &&
        getDate(today) === getDate(dueDate) &&
        EVENT_TYPES.GIFT_SELECTION_BIRTHDAY
    );
};

/**
 * this function tells whether an anniversary is today AND
 * are we really need to send an email for this one or not
 * @param date
 */
export const shallISendForAnniversary = (user: UserCsvRow) => {
    const date = new Date(user.joining_date);
    const today = new Date();
    const isToday =
        getMonth(today) === getMonth(date) && getDate(today) === getDate(date);
    return isToday && EVENT_TYPES.ANNIVERSARY;
};

/**
 * this function tells whether an anniversary gift selection email
 * is today AND are we really need to send an email for this one or not
 * @param date
 */
export const shallISendForAnniversaryGiftSelection = (user: UserCsvRow) => {
    const date = new Date(user.joining_date);
    const dueDate = subDays(date, SEND_GIFT_SELECTION_EMAIL_BEFORE); // before how many days
    const today = new Date();
    const isToday =
        getMonth(today) === getMonth(dueDate) &&
        getDate(today) === getDate(dueDate);
    const numberOfYears = differenceInYears(today, dueDate);
    return (
        isToday &&
        ALLOWED_GIFTED_ANNIVERSARIES.includes(numberOfYears) &&
        EVENT_TYPES.GIFT_SELECTION_ANNIVERSARY
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
    const context = pleaseGetContext(template, user);
    const subject = pleaseCompileTemplate(template.subject, context);
    const htmlBody = await pleaseCompileRegisteredTemplate(template, context);
    const attmnts = template.attachments.map((attachment) => {
        return {
            ...attachment,
            filename: pleaseCompileTemplate(attachment.filename, context),
            path: pleaseCompileTemplate(attachment.path, context),
        };
    });
    return tranporter.sendMail({
        ...EMAIL_USERS,
        to: `${user.name} <${user.email}>`,
        subject,
        html: htmlBody,
        attachments: attmnts,
    });
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

export const emailSuccessLogger = createLogger({
    format: format.combine(
        format.label({ label: "Emails" }),
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.File({
            filename: `logs/success_emails_${formatDate(
                new Date(),
                "yyyy-MM-dd"
            )}.log`,
        }),
    ],
});

export const emailErrorLogger = createLogger({
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
            filename: `logs/error_emails_${formatDate(
                new Date(),
                "yyyy-MM-dd"
            )}.log`,
            handleExceptions: true,
        }),
    ],
});

/**
 * convert simple number to string with ordinal like 1st, 2nd, 24th
 *
 * @param n
 */
export const withOrdinal = (n: number) => {
    const ordinal =
        ["st", "nd", "rd"][(((((n < 0 ? -n : n) + 90) % 100) - 10) % 10) - 1] ||
        "th";
    return `${n}${ordinal}`;
};
