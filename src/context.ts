import {
    EVENT_TYPES,
    NUMBER_OF_BIRTHDAY_CARDS,
    TemplateRegistry,
    UserCsvRow,
} from "./types";
import { differenceInYears } from "date-fns";
import { GIFT_SELECTION_FORM_LINK } from "./env";

/**
 * Register your context handlers
 * specific to event type here
 */
export const contextHandlers = {
    [EVENT_TYPES.BIRTHDAY]: (template: TemplateRegistry, user: UserCsvRow) => {
        const attachmentUrls = template.attachments.reduce(
            (result, attachment) => {
                return {
                    ...result,
                    [attachment.cid]: "cid:" + (attachment.cid || ""),
                };
            },
            {} as { [key: string]: string }
        );
        return {
            userName: user.name,
            filename: `${(Math.floor(Math.random() * 1000) %
                NUMBER_OF_BIRTHDAY_CARDS) +
                1}.png`,
            ...attachmentUrls,
        };
    },
    [EVENT_TYPES.ANNIVERSARY]: (
        template: TemplateRegistry,
        user: UserCsvRow
    ) => {
        const attachmentUrls = template.attachments.reduce(
            (result, attachment) => {
                return {
                    ...result,
                    [attachment.cid]: "cid:" + (attachment.cid || ""),
                };
            },
            {} as { [key: string]: string }
        );
        const joiningDate = new Date(user.joining_date);
        const numberOfYears = differenceInYears(new Date(), joiningDate);
        const numberOfYearsWithOrdinal = withOrdinal(numberOfYears);
        return {
            userName: user.name,
            filename: `${numberOfYears}.png`,
            numberOfYears,
            numberOfYearsWithOrdinal,
            ...attachmentUrls,
        };
    },
    [EVENT_TYPES.GIFT_SELECTION_BIRTHDAY]: (
        template: TemplateRegistry,
        user: UserCsvRow
    ) => {
        const attachmentUrls = template.attachments.reduce(
            (result, attachment) => {
                return {
                    ...result,
                    [attachment.cid]: "cid:" + (attachment.cid || ""),
                };
            },
            {} as { [key: string]: string }
        );
        return {
            userName: user.name,
            gift_selection_form_link: GIFT_SELECTION_FORM_LINK,
            ...attachmentUrls,
        };
    },
    [EVENT_TYPES.GIFT_SELECTION_ANNIVERSARY]: (
        template: TemplateRegistry,
        user: UserCsvRow
    ) => {
        const attachmentUrls = template.attachments.reduce(
            (result, attachment) => {
                return {
                    ...result,
                    [attachment.cid]: "cid:" + (attachment.cid || ""),
                };
            },
            {} as { [key: string]: string }
        );
        return {
            userName: user.name,
            gift_selection_form_link: GIFT_SELECTION_FORM_LINK,
            ...attachmentUrls,
        };
    },
};

/**
 * This function will be called to
 * retrieve the context of a specific template.
 *
 *
 * Dont override this one unless you know what
 * you are doing. if you want to add some
 * more data to some specific template context.
 * then do it in `contextHandlers` object under
 * their specific event.
 *
 * @param template
 * @param user
 */
export const pleaseGetContext = (
    template: TemplateRegistry,
    user: UserCsvRow
) => {
    const contextHandler = contextHandlers[template.id];
    if (!contextHandler) {
        return {};
    }
    return contextHandler(template, user);
};

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
