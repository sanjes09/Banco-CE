//IMPORTS
const router = require("express").Router();
const { getAddressBalance, transferFrom } = require("../functions/web3");
const { ethers } = require("ethers");

//MODELS
const User = require("../models/User");
const Transaction = require("../models/Transaction");

router.get("/pay-with-tdc", async (req, res) => {
    /*
        tarjeta:
        cvv:
        fecha:
        monto:
        token:
     */
    try {
        const business = await User.findOne({token: req.body.token});
        if(!business){
            res.status(400).json({
                ok: false,
                error: "Token invalido"
            });
            return;
        }

        const user = await User.findOne({tarjeta: req.body.tarjeta, cvv: req.body.cvv});
        if(!user){
            res.status(400).json({
                ok: false,
                error: "Tarjeta y/o cvv invalido"
            });
            return;
        }
        if(user.expirationDate !== req.body.fecha){
            res.status(400).json({
                ok: false,
                error: "Fecha de expiracion erronea"
            });
            return;
        }

        if(Number(user.amount) - Number(req.body.monto) < 0){
            res.status(400).json({
                ok: false,
                error: "Saldo insuficiente"
            });
            return;
        }

        business.balance = Number(business.balance) + Number(req.body.monto);
        user.balance = Number(user.balance) - Number(req.body.monto);

        await business.save();
        await user.save();

        const tx = new Transaction({
            from: user._id,
            to: business._id,
            method: "tdc",
            amount: req.body.monto,
        })
        await tx.save();
        
    } catch (error) {
        console.log('error', error)
        res.status(400).json({
            ok: false,
            error
        });
        return;
    }
});

router.post("/pay-with-cripto", async (req, res) => {
    /*
        correo:
        pin:
        monto:
        token:
     */
    try {
        const business = await User.findOne({token: req.body.token});
        if(!business){
            res.status(400).json({
                ok: false,
                error: "Token invalido"
            });
            return;
        }

        const user = await User.findOne({email: req.body.correo, pin: req.body.pin});
        if(!user){
            res.status(400).json({
                ok: false,
                error: "Correo o pin invalido"
            });
            return;
        }

        const balance = await getAddressBalance(user.address);

        if(Number(balance) - Number(req.body.monto) < 0){
            res.status(400).json({
                ok: false,
                error: "Saldo insuficiente"
            });
            return;
        }
        
        const correctAmount = ethers.parseEther(req.body.monto);
        await transferFrom(user.address, business.address, correctAmount);

        const tx = new Transaction({
            from: user._id,
            to: business._id,
            method: "cripto",
            amount: req.body.monto,
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