//IMPORTS
const router = require("express").Router();
const ethers = require("ethers");
const { initAccount, getAddressBalance, transferFrom } = require("../functions/web3");

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

        console.log("Funding ", user.address);
        await initAccount(user.address, user.privKey);
        console.log(user.address, "Fully funded");
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
        const toUser = await User.findOne({address: req.body.account});

        if(!toUser) {
            res.status(400).json({
                ok: false,
                error: "Cuenta invalida"
            });
            return;
        }

        const correctAmount = ethers.parseEther(req.body.amount);

        const cryptotx = await transferFrom(user.address, toUser.address, correctAmount);

        res.status(200).json({
            ok: true,
            tx: cryptotx
        });

        await cryptotx.wait();
        const tx = new Transaction({
            from: user._id,
            to: toUser._id,
            method: "cripto",
            amount: req.body.amount,
            txHash: cryptotx.hash
        })
        await tx.save();
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