require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = (req, res) => {
    const { destinationEmail, redirectLink } = req.body;

    if (destinationEmail && redirectLink) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        });


        const htmlContent =
            `
                <h1 style="color: #333;">
                    Welcome to Our Platform!
                </h1>
                <p style="font-size: 16px; color: #555;">
                    Thank you for creating an account on our platform. To activate your account, please click on the following link:
                </p>
                <p style="margin-top: 20px;">
                    <a href="${redirectLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px;">
                        Verify account
                    </a>
                </p>
                <p style="font-size: 14px; color: #777;">
                    If you have not created an account on our platform, you can ignore this message.
                </p>
            `;

        let mailOptions = {
            from: "proyectoprograweb5@gmail.com",
            to: destinationEmail,
            subject: 'User Verification for Prompt AI',
            html: htmlContent
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log("Error " + err);
                res.json(err);
            } else {
                console.log("Email sent successfully");
                res.json(data);
            }
        });
    } else {
        res.json({ message: "Required data is missing" });
    }
};


module.exports = {
    sendEmail
};
