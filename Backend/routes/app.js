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

router.get("/get-dashboard", async (req, res) => {
    const user = await User.findById(res.locals.userID);

    const txs = await Transaction.find({ $or:[ {from: user._id}, {to: user._id}]}).sort({date: "desc"})
    const cryptoBanlance = await getAddressBalance(user.address);
    const balance = user.balance;
    const cuenta = user.cuenta;

    res.status(200).json({
        ok: true,
        txs,
        cryptoBanlance,
        balance,
        cuenta
    });
    return;
});

module.exports = router;