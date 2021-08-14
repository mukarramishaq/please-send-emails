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
   git clone https://github.com/mukarramishaq/cloud-build-notifications.git
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
