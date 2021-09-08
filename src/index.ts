import * as csv from "fast-csv";
import { UserCsvRow } from "./types";
import {
    pleaseSendEmailsIfPending,
    getReadableStreamOfFile,
} from "./fns";

export type COUNTS = {
    total: number;
    sent: number;
    error: number;
};
const counts: COUNTS = {
    total: 0,
    sent: 0,
    error: 0,
};

export const readFileAndSendEmails = async (): Promise<COUNTS> => {
    return new Promise((resolve, reject) => {
        getReadableStreamOfFile("csvs/users.csv")
            .pipe(csv.parse({ headers: true }))
            // pipe the parsed input into a csv formatter
            .pipe(
                csv.format<UserCsvRow, UserCsvRow>({ headers: true })
            )
            // Using the transform function from the formatting stream
            .transform((row, next): void => {
                counts.total += 1;
                console.log("Total processed rows: ", counts.total);
                pleaseSendEmailsIfPending(row)
                    .then(async (sentEmails) => {
                        sentEmails.map((sentOne) => {
                            console.log(
                                "info",
                                `${sentOne.template.id} to ${row.email}`,
                                sentOne.sentMsg
                            );
                        });
                        counts.sent += sentEmails.length;
                        console.log("Total emails sent: ", counts.sent);
                        next();
                    })
                    .catch((e) => {
                        counts.error += 1;
                        console.log("Total rows error: ", counts.error);
                        console.error("error", e.message, e);
                        next();
                    });
            })
            .on("error", (e) => {
                reject(e);
            })
            .on("end", () => {
                resolve(counts);
            })
            .on("finish", () => {
                resolve(counts);
            });
    });
};
