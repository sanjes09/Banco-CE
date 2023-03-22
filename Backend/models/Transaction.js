const mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new mongoose.Schema({
    from: {type: Schema.Types.ObjectId, ref: "User"},
    to: {type: Schema.Types.ObjectId, ref: "User"},
    method: {type: String, required: true},
    amount: {type: Number, required: true},
    date: {type: Date, default: Date.now},
})

module.exports = mongoose.model('User', schema);
