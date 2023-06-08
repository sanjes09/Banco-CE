//IMPORTS
const router = require("express").Router();
const { getAddressBalance } = require("../functions/web3");

//ROUTERS
const web3Router = require("./web3");
const accountRouter = require("./account");
router.use(web3Router);
router.use(accountRouter);

//MODELS
const User = require("../models/User");
const Transaction = require("../models/Transaction");

router.get("/currentUser", async (req, res) => {
    const user = await User.findById(res.locals.userID);

    res.status(200).json({
        ok: true,
        user
    });
    return;
});

router.get("/get-balances", async (req, res) => {
    const user = await User.findById(res.locals.userID);

    const cryptoBalance = await getAddressBalance(user.address);
    const balance = user.balance;
    const cuenta = user.cuenta;
    const address = user.address;

    res.status(200).json({
        ok: true,
        cryptoBalance,
        balance,
        cuenta,
        address
    });
    return;
});

router.get("/get-history", async (req, res) => {
    const user = await User.findById(res.locals.userID);

    let txs = await Transaction.find({ $or:[ {from: user._id}, {to: user._id}]})
    .populate([{path: 'to', select: ['cuenta', 'address']}, {path: 'from', select: ['cuenta', 'address']}])
    .sort({date: "desc"})
    txs = txs.map((arg) => {
        const element = JSON.parse(JSON.stringify(arg))
        if(element.from._id.toString() === user._id.toString()) element.tipo = "out"
        else element.tipo = "in"
        return element
    })
    res.status(200).json({
        ok: true,
        txs,
    });
    return;
});

router.get("/get-business-history", async (req, res) => {
    const user = await User.findById(res.locals.userID);

    let txs = await Transaction.find({ $or:[ {from: user._id, external: true}, {to: user._id, external: true}]})
    .populate([{path: 'to', select: ['cuenta', 'address']}, {path: 'from', select: ['cuenta', 'address']}])
    .sort({date: "desc"})
    txs = txs.map((arg) => {
        const element = JSON.parse(JSON.stringify(arg))
        if(element.from._id.toString() === user._id.toString()) element.tipo = "out"
        else element.tipo = "in"
        return element
    })
    res.status(200).json({
        ok: true,
        txs,
    });
    return;
});

module.exports = router;