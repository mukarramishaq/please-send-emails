import { EVENT_TYPES, TemplateRegistry } from "./types";

/**
 * Register all your templates here.
 */
export const REGISTERED_EMAIL_TEMPLATES: TemplateRegistry[] = [
    {
        id: EVENT_TYPES.BIRTHDAY, // template name without extension
        subject: "Happy Birthday {{userName}}",
        attachments: [
            {
                filename: "{{filename}}",
                path: "images/birthday/{{filename}}",
                cid: "happy_birthday", // any unique string and it will serve as url to embed the picture in the email
            },
            {
                filename: "logo.png",
                path: "images/logo.png",
                cid: "logo_ec",
            },
        ],
    },
    {
        id: EVENT_TYPES.ANNIVERSARY, // template name without extension
        subject: "Happy {{numberOfYearsWithOrdinal}} Anniversary {{userName}}",
        attachments: [
            {
                filename: "{{filename}}",
                path: "images/anniversary/{{filename}}",
                cid: "happy_anniversary", // any unique string and it will serve as url to embed the picture in the email
            },
            {
                filename: "logo.png",
                path: "images/logo.png",
                cid: "logo_ec",
            },
        ],
    },
    {
        id: EVENT_TYPES.GIFT_SELECTION_BIRTHDAY, // template name without extension
        subject: "Gift Selection for Birthday",
        attachments: [
            {
                filename: "logo.png",
                path: "images/logo.png",
                cid: "logo_ec",
            },
        ],
    },
    {
        id: EVENT_TYPES.GIFT_SELECTION_ANNIVERSARY, // template name without extension
        subject:
            "Gift Selection for your {{numberOfYearsWithOrdinal}} Anniversary",
        attachments: [
            {
                filename: "logo.png",
                path: "images/logo.png",
                cid: "logo_ec",
            },
        ],
    },
];
