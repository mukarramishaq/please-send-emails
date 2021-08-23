import * as path from "path";
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
                filename: "happy-birthday.png",
                path: path.resolve(
                    __dirname,
                    "assets",
                    "images",
                    "happy-birthday.png"
                ),
                cid: "happy.birthday.unique.mk", // any unique string and it will serve as url to embed the picture in the email
            },
        ],
    },
    {
        id: EVENT_TYPES.ANNIVERSARY, // template name without extension
        subject: "Happy Anniversary {{userName}}",
        attachments: [
            {
                filename: "{{filename}}",
                path: path.resolve(
                    __dirname,
                    "assets",
                    "images",
                    "anniversary",
                    "{{filename}}"
                ),
                cid: "happy.anniversary.unique.mk", // any unique string and it will serve as url to embed the picture in the email
            },
        ],
    },
    {
        id: EVENT_TYPES.GIFT_SELECTION_BIRTHDAY, // template name without extension
        subject: "Gift Selection for Birthday",
        attachments: [],
    },
    {
        id: EVENT_TYPES.GIFT_SELECTION_ANNIVERSARY, // template name without extension
        subject: "Gift Selection for Anniversary",
        attachments: [],
    },
];
