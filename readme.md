# Please Send Emails

This parses the csv file and send emails like happy birthday or anniversary accordingly.

## Prerequisites

Make sure you have the following items setup on your system:

1. node
2. npm or yarn
3. Email account, of course!

## How to Setup?

1. Take a clone of this repository:

   ```shell
   git clone https://github.com/mukarramishaq/please-send-emails.git
   ```

2. Rename `.env.sample` file to `.env` and update the values to that of yours.

3. Install dependencies:

    ```shell
   yarn install #or npm install
   ```

4. Run it to send today's pending emails:

    ```shell
    yarn please-send-emails
    ```

### How to update users data

Update Users in `src/assets/csvs/users.csv`

   1. This file has 4 columns
      1. `name` full name in initial letters in capital
      2. `email` email address of the user
      3. `birth_date` date of birth in `yyyy-mm-dd` format only
      4. `joining_date` date of joining in `yyyy-mm-dd` format only
   2. update this file or replace it with yours with similar structure

### How to update email templates

Update email templates in `src/assets/email-templates/` folder. Currently two templates are supported:

1. `happy-birthday.html`
2. `happy-anniversary.html`

These are `Handlebar` templates. All the variables are in `handlebars` format. Update the content as you like. But if the updated template has new variables then you need to update its context object:

1. Update the template context object (i.e an object that contains all variables data which are being used in the template) in function [pleaseGetTemplateContext](https://github.com/mukarramishaq/please-send-emails/blob/53fd64d67f306328e2ba0c9cbf67be9f2eb1c940/src/fns.ts#L92) and populate the context object with new variables under specific event type only.

### How to add new email templates

Following are the steps:
1. add HTML template to `src/assets/email-templates/` folder under some unique name
2. register the event of this template in `src/types.ts` under [EVENT_TYPES](https://github.com/mukarramishaq/please-send-emails/blob/53fd64d67f306328e2ba0c9cbf67be9f2eb1c940/src/types.ts#L36) enum
3. register this email template in [src/emailTemplatesRegister.ts](https://github.com/mukarramishaq/please-send-emails/blob/main/src/emailTemplatesRegister.ts) by adding a new object of `TemplateRegistry`.
4. Update the template context object (i.e an object that contains all variables data which are being used in the template) in function [pleaseGetTemplateContext](https://github.com/mukarramishaq/please-send-emails/blob/53fd64d67f306328e2ba0c9cbf67be9f2eb1c940/src/fns.ts#L92) by adding a new if clause of your specific event type and populate the context object with new variables.

### Setup for SMTP Configurations

This repository use [nodemailer](https://nodemailer.com/about/) to send emails through SMTP transporter. Currently, this repository supports two types of authentication for SMTP:

1. LOGIN
   1. It uses `Email Address` and `Password` to authenticate. It is less secure and for gmail, you'll have to allow less secure apps beforehand.
2. OAUTH2
   1. It uses `Client ID`, `Client Secret` and `Refresh Token` to authenticate

Following ENV variables are necessary irrespective of the authentication type:

1. `SMTP_HOST` e.g for gmail its value is `smtp.gmail.com`.
2. `SMTP_PORT` e.g `465` for secure and `587` for not secure.
3. `SMTP_AUTH_TYPE` It can have one of the following values:
   1. `LOGIN`
   2. `OAUTH2`
4. `SMTP_AUTH_USER` this is an email address through this nodemailer will authenticate and send emails

Now if your authentication type is `LOGIN`, uncomment and update the values of the following ENV variables:

1. `SMTP_AUTH_LOGIN_PASS` This is password to email address

And if your authentication type is `OAUTH2`, uncomment and update the values of the following ENV variables:

1. `SMTP_AUTH_OAUTH2_CLIENT_ID`
2. `SMTP_AUTH_OAUTH2_CLIENT_SECRET`
3. `SMTP_AUTH_OAUTH2_REFRESH_TOKEN`

Now to configure the sender and recipients name and emails, uncomment and update the following ENV variables:

1. `EMAIL_FROM` i.e sender of this email notification
2. `EMAIL_TO` a comma-separated list of recipients emails

There are two more optional variables `EMAIL_CC` and `EMAIL_BCC` to configure a list of recipients as `CC` or `BCC`. Both these variables accept a comma-separated list of emails.
