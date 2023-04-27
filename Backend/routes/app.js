//IMPORTS
const router = require("express").Router();

//FUNCTIONS
const { decodeToken } = require('../functions/token');

//MODELS
const User = require("../models/User");

router.get("/currentUser", async (req,res) => {
    const token = req.header("Authorization");
    if (!token){
        res.status(401).json({ 
            ok: false,
            error: "Access Denied" 
        });
        return;
    }else{
        let response = await decodeToken(token.split(" ")[1], process.env.SESSION_TOKEN);
        if(response.error){
            res.status(401).json({
                ok: false,
                error: response.error
            });
            return;
        }else{
            let user = await User.findById(response.data._id);
            res.status(200).json({
                ok: true,
                user
            });
            return;
        }
    }
});

module.exports = router;