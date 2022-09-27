const nodemailer = require("nodemailer");
const { config: { mail } } = require('./../config');

const sendEmail = (email, subject, html) => {
    return new Promise(async (resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                host: mail.host,
                service: mail.service,
                port: 587,
                secure: true,
                auth: {
                    user: mail.user,
                    pass: mail.pwd,
                },
            });

            await transporter.sendMail({
                from: mail.user,
                to: email,
                subject,
                html,
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    sendEmail
};
