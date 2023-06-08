//IMPORTS
const router = require("express").Router();
const { hash } = require('../functions/passwordHash');

//MODELS
const User = require("../models/User");
const Transaction = require("../models/Transaction");

router.get("/generate-tdc", async (req, res) => {
    try {
        const user = await User.findById(res.locals.userID);

        user.creditCard = "4242"+Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
        user.cvv = Math.floor(100 + Math.random() * 900);
        user.expirationDate = "04/26";

        await user.save();

        res.status(200).json({
            ok: true,
            creditCard: user.creditCard,
            cvv: user.cvv
        });
        return;
        
    } catch (error) {
        console.log('error', error)
        res.status(400).json({
            ok: false,
            error
        });
        return;
    }
});

router.get("/generate-business-token", async (req, res) => {
    try {
        const user = await User.findById(res.locals.userID);
        const hashedId = await hash(String(user._id));
        user.token = hashedId.substring(8,29);
        user.juridico = true;
        
        await user.save();

        res.status(200).json({
            ok: true,
            token: user.token,
        });
        return;
        
    } catch (error) {
        console.log('error', error)
        res.status(400).json({
            ok: false,
            error
        });
        return;
    }
});

router.get("/get-account-balance", async (req, res) => {
    try {
        const user = await User.findById(res.locals.userID);

        res.status(200).json({
            ok: true,
            balance: user.balance
        });
        return;
    } catch (error) {
        console.log('error', error)
        res.status(400).json({
            ok: false,
            error
        });
        return;
    }
});

router.post("/transfer", async (req, res) => {
    try {
        const user = await User.findById(res.locals.userID);
        const toUser = await User.findOne({cuenta: req.body.account});
        
        if(Number(toUser.balance) - Number(req.body.amount) < 0){
            res.status(400).json({
                ok: false,
                error: "Saldo insuficiente"
            });
            return;
        }

        user.balance = Number(user.balance) + Number(req.body.amount);
        toUser.balance = Number(toUser.balance) - Number(req.body.amount);

        await user.save();
        await toUser.save();

        const tx = new Transaction({
            from: user._id,
            to: toUser._id,
            method: "banco",
            amount: req.body.amount,
        })
        await tx.save();

        res.status(200).json({
            ok: true
        });
        return;
    } catch (error) {
        console.log('error', error)
        res.status(400).json({
            ok: false,
            error
        });
        return;
    }
});

module.exports = router;