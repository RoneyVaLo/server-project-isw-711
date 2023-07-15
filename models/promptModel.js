const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prompt = new Schema({
    user: {
        type: mongoose.ObjectId,
        ref: 'Users'
    },
    name: { type: String },
    type: { type: String },
    data: { type: Object },
    tags: { type: Array },
    results: { type: Array }
});

module.exports = mongoose.model('Prompts', prompt);
