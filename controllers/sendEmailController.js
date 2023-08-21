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
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; text-align: center;">
                <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); padding: 20px;">
                    <tr>
                        <td>
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
                        </td>
                    </tr>
                </table>
            </body>
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
                
                res.status(200).json(data);
            }
        });
    } else {
        res.status(400).json({ message: "Required data is missing" });
    }
};


module.exports = {
    sendEmail
};
