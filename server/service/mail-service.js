const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link, expireDurationString = null) {
        await new Promise((resolve, reject) => {
            this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Activation of your account ' + process.env.API_URL,
                text: '',
                html:
                    `
                        <div>
                            <h1>To activate the account click on the link below:</h1>
                            <a href="${link}">${link}</a>
                            ${expireDurationString ? `<p>The mail expires after ${expireDurationString}</p>` : ""}
                        </div>
                    `
            }, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            })
        })
    }

    async sendEmailConfirmationMail(to, link, expireDurationString = null) {
        await new Promise((resolve, reject) => {
            this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Confirm email ' + process.env.API_URL,
                text: '',
                html:
                    `
                        <div>
                            <h1>To change current account email confirm this one (there are 2 of them) by clicking on the link below:</h1>
                            <a href="${link}">${link}</a>
                            ${expireDurationString ? `<p>The mail expires after ${expireDurationString}</p>` : ""}
                        </div>
                    `
            }, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            })
        })
    }
}

module.exports = new MailService();
