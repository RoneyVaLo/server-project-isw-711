const crypto = require('crypto');
const Session = require("../models/sessionModel");

const saveSession = async function (user) {
    
    // Token encryption
    const token = crypto.createHash('md5').update(user.user_name).digest("hex");

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    const existSessions = await getSession(token);

    if (existSessions.length > 0) {
        const notExpired = existSessions.filter(session => session.expire >= currentDate.getDate());
        if (notExpired.length > 0) return;
    };

    // insert token to the session table
    const session = new Session();
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
