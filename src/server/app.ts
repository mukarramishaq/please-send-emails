import express, { NextFunction, Request, Response } from "express";
import { readFileAndSendEmails } from "../index";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.body?.please_send_emails) {
        throw new Error("Wrong message");
    }
    next();
}); // apply message validator of required vendor
app.use(async (req: Request, res: Response, next: NextFunction) => {
    const counts = await readFileAndSendEmails();
    res.json({
        title: "Emails are sent",
        message: `total: ${counts.total}, sent: ${counts.sent}, error: ${counts.error}`,
    });
});

export default app;
