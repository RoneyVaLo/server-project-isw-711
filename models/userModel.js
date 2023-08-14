const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema(
    {
        first_name: { type: String },
        last_name: { type: String },
        age: { type: Number },
        role: { type: String },
        email: { type: String, unique: true },
        password: { type: String },
        profile_image: { type: String },
        verified: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Users', user);
