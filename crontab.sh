#!/usr/bin/env bash

# Ensure the log file exists
touch /app/logs/crontab.log

# Ensure permission on the command
chmod a+x /app/lib/sendEmailsNow.js

# Added a cronjob in a new crontab
echo "2 * * * * /usr/local/bin/node /app/lib/sendEmailsNow.js >> /app/logs/crontab.log 2>&1" > /etc/crontab

# Registering the new crontab
crontab /etc/crontab

# Starting the cron
/usr/sbin/service cron start
