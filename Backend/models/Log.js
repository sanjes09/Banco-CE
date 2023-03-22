const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    data: String,
    createdAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Log', schema);
