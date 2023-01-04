import nodemailer, { createTestAccount } from 'nodemailer';

import config from './index';
// this is used to send mail to user for forgot password casse
let transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_MAIL_PORT,
    secure: false, //true for 465, false for other ports
    auth: {
        user: config.SMTP_MAIL_USERNAME, // generated ethereal user
        pass: config.SMTP_MAIL_PASSWORD, // generated ethereal password
    }
})

export default transporter;