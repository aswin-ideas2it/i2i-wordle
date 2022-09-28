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
                list: {
                    unsubscribe: {
                        url: `https://ponniyinselvan.ideas2it.com/unsubscribe?email=${email}`,
                        comment: 'Un Subscribe'
                    }
                },
                to: email,
                subject,
                html,
            });
            resolve();
            console.log('Mail sent successfully');
        } catch (error) {
            console.log('Mail not sent', error);
            reject(error);
        }
    });
};

module.exports = {
    sendEmail
};
