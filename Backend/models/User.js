const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    active: {type: Boolean, default: false},

    // web2
    cuenta: {type: String, default: 0},
    balance: {type: Number, default: 0},
    creditCard: {type: Number, default: 0},
    cvv: {type: Number, default: 0},
    expirationDate: {type: String, default: 0},
    
    // web3
    paymentPin: {type: Number},
    mnemonic: {type: String},
    address: {type: String},
    privKey: {type: String},

    //empresa
    juridico: {type: Boolean, default: false},
    token: {type: String}
})

module.exports = mongoose.model('User', schema);
