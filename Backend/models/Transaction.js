const mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new mongoose.Schema({
    from: {type: Schema.Types.ObjectId, ref: "User"},
    to: {type: Schema.Types.ObjectId, ref: "User"},
    method: {type: String, required: true},
    txHash: {type: String},
    amount: {type: Number, required: true},
    external: {type: Boolean, default: false},
    date: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Transaction', schema);
