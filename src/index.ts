import * as fs from "fs";
import * as path from "path";
import * as csv from "fast-csv";
import { UserCsvRow, UserProcessedRow } from "./types";
import { pleaseSendEmailsIfPending, sentEmailsLogger } from "./fns";

fs.createReadStream(path.resolve(__dirname, "assets", "csvs", "users.csv"))
    .pipe(csv.parse({ headers: true }))
    // pipe the parsed input into a csv formatter
    .pipe(
        csv.format<UserCsvRow, UserProcessedRow>({ headers: true })
    )
    // Using the transform function from the formatting stream
    .transform((row, next): void => {
        pleaseSendEmailsIfPending(row).then(async (sentEmails) => {
            sentEmails.map((sentOne) => {
                sentEmailsLogger.log(
                    "info",
                    `${sentOne.template.id} to ${row.email}`,
                    sentOne.sentMsg
                );
            });
        });
    })
    .on("end", () => process.exit());
