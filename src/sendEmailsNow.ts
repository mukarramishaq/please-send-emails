import { readFileAndSendEmails } from "./index";

readFileAndSendEmails()
    .then((d) => {
        console.log(`${new Date().toString()}:: emails sent`);
    })
    .catch((e) => {
        console.error(`${new Date().toString()}:: Error occurred: `, e);
    });
