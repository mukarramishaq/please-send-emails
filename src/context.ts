import {
    EVENT_TYPES,
    NUMBER_OF_BIRTHDAY_CARDS,
    TemplateRegistry,
    UserCsvRow,
} from "./types";
import { differenceInYears } from "date-fns";
import { withOrdinal } from "./fns";

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
            filename: `${
                (Math.floor(Math.random() * 1000) % NUMBER_OF_BIRTHDAY_CARDS) +
                1
            }.png`,
            ...attachmentUrls,
        };
    },
    [EVENT_TYPES.ANNIVERSARY]: (
        template: TemplateRegistry,
        user: UserCsvRow
    ) => {
        const attachmentUrls = template.attachments.map((attachment) => {
            return {
                [attachment.cid]: "cid:" + (attachment.cid || ""),
            };
        });
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
        const attachmentUrls = template.attachments.map((attachment) => {
            return {
                [attachment.cid]: "cid:" + (attachment.cid || ""),
            };
        });
        return {
            userName: user.name,
            ...attachmentUrls,
        };
    },
    [EVENT_TYPES.GIFT_SELECTION_ANNIVERSARY]: (
        template: TemplateRegistry,
        user: UserCsvRow
    ) => {
        const attachmentUrls = template.attachments.map((attachment) => {
            return {
                [attachment.cid]: "cid:" + (attachment.cid || ""),
            };
        });
        return {
            userName: user.name,
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
