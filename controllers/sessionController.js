const crypto = require('crypto');
const Session = require("../models/sessionModel");

const saveSession = async function (user) {

    // Token encryption
    const token = crypto.createHash('md5').update(user.email).digest("hex");

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    const session = new Session();

    const existSessions = await getSession(token);

    if (existSessions.length > 0) {
        const notExpired = existSessions.filter(session => session.expire >= (new Date()));
        if (notExpired.length > 0) {
            session.token = notExpired[0].token;
            session.user = user._id;
            session.expire = notExpired[0].expire;
            return session;
        };
    };

    // insert token to the session table
    session.token = token;
    session.user = user._id;
    session.expire = currentDate;

    return session.save();
};

const getSession = function (token) {
    return Session.find({ token });
};

module.exports = {
    saveSession,
    getSession
}
