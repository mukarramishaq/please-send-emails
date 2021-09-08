export interface UserCsvRow {
    name: string;
    email: string;
    birth_date: string;
    joining_date: string;
}

export interface UserProcessedRow {
    name: string;
    email: string;
    birth_date: string;
    joining_date: string;
    birthday_email_sent_on: string;
    anniversary_email_sent_on: string;
}

export type TemplateRegistry = {
    id: EVENT_TYPES; // must be unique and must match with template name without extension
    subject: string;
    attachments: Attachment[];
};

export type Attachment = {
    filename: string;
    path: string; // absolute path
    cid: string; // unique key to this attachment and it can serve as url in case you want to emebed a picture in body
};

export enum EVENT_TYPES {
    BIRTHDAY = "happy-birthday",
    ANNIVERSARY = "happy-anniversary",
    GIFT_SELECTION_BIRTHDAY = "gift-selection-birthday",
    GIFT_SELECTION_ANNIVERSARY = "gift-selection-anniversary",
}

export const ALLOWED_GIFTED_ANNIVERSARIES = [1, 5, 10, 15, 20];

export const SEND_GIFT_SELECTION_EMAIL_BEFORE = 20; // in days

export const NUMBER_OF_BIRTHDAY_CARDS = 16;
