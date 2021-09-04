import express, { NextFunction, Request, Response } from "express";
import { readFileAndSendEmails } from "../index";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    if (!body.message?.attributes?.please_send_emails) {
        throw new Error("Not a valid message");
    }
    next();
}); // apply message validator of required vendor
app.use(async (req: Request, res: Response, next: NextFunction) => {
    const counts = await readFileAndSendEmails().catch((e) => {
        console.error("Error while sending emails: ", e);
        return { total: 0, sent: 0, error: 0 };
    });
    res.status(200).json({ success: true });
});

export default app;
