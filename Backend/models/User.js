const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, required: true},
    createdAt: {type: Date, default: Date.now},
    active: {type: Boolean, default: false},

    // web2
    balance: {type: Number, default: 0},
    creditCard: {type: Number, default: 0},
    cvv: {type: Number, default: 0},
    
    // web3
    address: {type: String},
    privKey: {type: String},
})

module.exports = mongoose.model('User', schema);
