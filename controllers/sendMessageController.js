require('dotenv').config();
const crypto = require('crypto');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = require('twilio')(accountSid, authToken);

const generateRandomCode = () => {
    const randomBytes = crypto.randomBytes(3);
    const hexString = randomBytes.toString('hex');
    const code = hexString.slice(0, 6);

    return code;
};


const validatePhoneNumber = (userNumber) => {
    const phoneNumberRegex = /^\+\d{1,3}\s?\d{1,14}$/;
    return phoneNumberRegex.test(userNumber);
}

const sendMessage = (req, res) => {
    const { destination } = req.body;
    if (validatePhoneNumber(destination)) {
        const code2FA = generateRandomCode();
        const messageBody = `Hello! Your security code for the app is ${code2FA}. Use it for 2FA when logging in. Thank you!`;

        twilioClient.messages
            .create({
                body: messageBody,
                from: twilioPhoneNumber,
                to: destination
            })
            .then(message => {
                console.log(message.sid);
                res.json({ message: "Code send successfully", code: code2FA });
            });
    } else {
        res.json({ message: "Phone Number invalid!!" });
    }
};

module.exports = {
    sendMessage
}
