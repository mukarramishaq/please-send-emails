import * as fs from "fs";
import * as path from "path";
import * as csv from "fast-csv";
import { UserCsvRow, UserProcessedRow } from "./types";
import {
    pleaseSendEmailsIfPending,
    emailSuccessLogger,
    emailErrorLogger,
} from "./fns";

const counts = {
    total: 0,
    sent: 0,
    error: 0,
};

fs.createReadStream(path.resolve(__dirname, "assets", "csvs", "users.csv"))
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
                    emailSuccessLogger.log(
                        "info",
                        `${sentOne.template.id} to ${row.email}`,
                        sentOne.sentMsg
                    );
                });
                counts.sent += sentEmails.length;
                console.log("Total emails sent: ", counts.sent);
            })
            .catch((e) => {
                counts.error += 1;
                console.log("Total rows error: ", counts.error);
                emailErrorLogger.log("error", e.message, e);
            });
        next();
    })
    .on("end", () => {
        process.exit();
    });
