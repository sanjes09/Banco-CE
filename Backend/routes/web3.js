//IMPORTS
const router = require("express").Router();
const ethers = require("ethers");
const { initAccount, getAddressBalance, transfer } = require("../functions/web3");

//FUNCTIONS

//MODELS
const User = require("../models/User");
const Transaction = require("../models/Transaction");

router.get("/generate-wallet", async (req, res) => {
    try {
        const user = await User.findById(res.locals.userID);
        const wallet = ethers.Wallet.createRandom()

        user.mnemonic = wallet.mnemonic.phrase;
        user.address = wallet.address;
        user.privKey = wallet.privateKey;

        await user.save();

        res.status(200).json({
            ok: true,
            userAddress: user.address
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

router.get("/activate-wallet", async (req, res) => {
    try {
        const user = await User.findById(res.locals.userID);

        await initAccount(user.address, user.privKey);

        res.status(200).json({
            ok: true,
            userAddress: user.address
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

router.get("/get-wallet-balance", async (req, res) => {
    try {
        const user = await User.findById(res.locals.userID);
        const balance = await getAddressBalance(user.address);
        res.status(200).json({
            ok: true,
            balance
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

router.post("/transfer-token", async (req, res) => {
    try {
        const user = await User.findById(res.locals.userID);
        const toUser = await User.findOne({cuenta: req.body.cuenta});
        const correctAmount = ethers.parseEther(req.body.amount);

        await transfer(user.address, toUser.address, correctAmount);
        const tx = new Transaction({
            from: user._id,
            to: toUser._id,
            method: "cripto",
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