const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const session = new Schema({
    token: { type: String },
    user: {
        type: mongoose.ObjectId,
        ref: 'Users'
    },
    expire: { type: Date }
});

module.exports = mongoose.model('Sessions', session);
