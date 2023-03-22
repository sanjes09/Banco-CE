const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    email: String,
    createdAt: Number,
    token: Number
})

module.exports = mongoose.model('Confirm', schema);