//IMPORTS
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const { transporter } = require('../functions/transporter');

//FUNCTIONS
const { hash, compare } = require('../functions/passwordHash');
const { decodeToken } = require('../functions/token');

//MODELS
const User = require("../models/User");
const Confirm = require("../models/Confirm");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
const passRegexp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/

//ROUTES
router.get('/logged', async (req,res) => {
    const token = req.header("Authorization");
    if (!token){
        res.status(401).json({ 
            ok: false
        });
        return;
    }else{
        let response = await decodeToken(token.split(" ")[1], process.env.SESSION_TOKEN);
        if(response.error){
            res.status(401).json({
                ok: false
            });
            return;
        }else{
            res.status(200).json({
                ok: true
            });
            return;
        }
    }
});

router.post( '/login', async ( req, res ) => {
    const { email, password } = req.body;
    if ( ! email || ! password ) {
        res.status(422).json({ 
            ok: false,
            error: "Missing data" 
        });
        return;
    };

    if(!email.match(emailRegexp)){
        res.status(422).json({
            ok: false,
            error: 'Invalid Email'
        });
        return;
    }

    const data = await User.find({ email })
    if (!data.length) {
        res.status(404).json({ 
            ok: false,
            error: "User not found"
        });
        return;
    };
    if(!data[0].active){
        res.status(400).json({ 
            ok: false,
            error: "Email not confirmed" 
        });
        return;
    };
    let user = data[0];
    let hashedPassword = user.password;
    let validUser;
    try{
        validUser = await compare(password,hashedPassword);
    }catch(e){
        res.status(400).json({ 
            error: "Unknown error, please try later" 
        });
        console.log('Password comparing error: ',e);
        return;
    };
    if ( validUser ) {
        console.log(user._id+" logging in");
        let token = jwt.sign({userID: user._id}, process.env.SESSION_TOKEN ,{ expiresIn: '1h' });
        res.status(200).json({
            ok: true,
            user,
            token
        })
        return;
    }else{
        res.status(422).json({
            ok: false
        });
        return;
    };
});

router.post( '/signup', async ( req, res ) => {
    const { name, email, password } = req.body;
    if (!password) {
        res.status(404).json({ 
            ok: false,
            error: "Missing password" 
        });
        return;
    }
    
    if(!email.match(emailRegexp)){
        res.status(422).json({
            ok: false,
            error: 'Invalid Email format'
        });
        return;
    }

    if(!password.match(passRegexp)){
        res.status(422).json({
            ok: false,
            error: 'Invalid Password format'
        });
        return;
    }

    const data = await User.find({ email });
    if (data.length) {
        res.status(400).json({ 
            ok: false,
            error: "Email already taken" 
        });
        return;
    };

    let hashedPassword = await hash(password);
    let user;

    try{
        user = new User({
            name,
            email,
            password: hashedPassword,
            valid: true
        });
        user.cuenta = "0105"+Math.floor(10000000000000000 + Math.random() * 90000000000000000).toString()
    }catch{
        res.status(400).json({
            ok: false,
            error: "Wrong data, email not valid."
        });
        return;
    }

    let digits = Math.floor(100000 + Math.random() * 900000);
    let confirm = await new Confirm({email: email, token: digits, createdAt: Date.now()});
    
    let numero = digits.toString();
    
    var mailOptions = {
        from: `Cryptobanco <${process.env.EMAIL_USER}>`,
        to: req.body.email,
        subject: 'Verify Account',
        html: `
        <div style="text-align: center; margin: 5px;">
        <h1 style="color: #26a3a2;">Verify Email Account</h1>
        <h2>This is the code to verify your account</h2><br/>
        <span style="font-size: 45px; font-weight: bold;">${numero[0]}-${numero[1]}-${numero[2]}  ${numero[3]}-${numero[4]}-${numero[5]}</span>
        </div>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('signup error :', error);
            res.status(400).json({
                ok: false,
                error
            })
            return;
        } else {
            confirm.save();
            user.save();
            res.status(200).json({
                ok: true
            })
            return;
        }
    });
});

//------RESET PASSWORD-------
router.post( '/reset-password', async ( req, res )=>{
    const data = await User.find({ email: req.body.email })
    if (!data.length) {
        res.status(404).json({ 
            ok: false,
            error: "Email not found"
        });
        return;
    };

    let token = jwt.sign({email: req.body.email}, 'resetPassword' ,{ expiresIn: '1h' });
    let link = `${req.headers.x-forwarded-proto}://${req.headers.host}/recover-password/${token}`;
    
    var mailOptions = {
        from: `Cryptobanco <${process.env.EMAIL_USER}>`,
        to: req.body.email,
        subject: 'Reset Password',
        html: `
            <div style="text-align: center; margin: 5px;">
                <img src='${req.headers.x-forwarded-proto}://${req.headers.host}/Healthcommons.png' style="display: flex; width: 28%; margin-right: auto; margin-left: auto;"/>
                <h1 style="color: #26a3a2;">Reset Password</h1>
                <h3>Click the button to reset your password</h3>
                <a href="${link}" style="font-size: 20px; text-decoration: none; color: white; background-color: #26a3a2; border-radius: 7px; padding: 5px;">Click Here!</a>
                <br/>
            </div>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.status(400).json({
                ok: false,
                error
            })
            return;
        } else {
            res.status(200).json({
                ok: true
            })
            return;
        }
    });
});

router.post( "/verify-reset", (req,res) => {
    jwt.verify(req.body.token, 'resetPassword', async (err, decoded) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: "Token Expired"
            });
            return;
        }else{
            res.status(200).json({
                ok: true,
                email: decoded.email
            });
            return;
        };
    });
});

router.post( "/new-password", async (req,res) => {
    jwt.verify(req.body.token, 'resetPassword', async (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                error: "Token Expired"
            });
            return;
        }else{
            const data = await User.find({ email: decoded.email })
            if (!data.length) {
                res.status(404).json({ 
                    ok: false,
                    error: "Email not found"
                });
                return;
            }else{
                try {
                    let user = data[0];
                    let hashedPassword = await hash(req.body.password);
                    user.password = hashedPassword;
                    await user.save();
                    res.status(200).json({
                        ok: true,
                        email: decoded.email
                    });
                    return;
                } catch (error) {
                    res.status(400).json({ 
                        ok: false,
                        error
                    });
                    return;
                }
            }
        };
    });
});
//------RESET PASSWORD-------

//------VERIFY ACCOUNT-------
router.post('/confirm-account', async ( req, res ) =>{
    try {
        let confirm = await Confirm.findOne({email: req.body.email})
        if(((new Date) - confirm.createdAt) > 5*60*1000){
            res.status(400).json({
                ok: false,
                error: "Code Expired!"
            });
        }else{
            if(confirm.token === parseInt(req.body.token)){
                await User.findOneAndUpdate({email: req.body.email} , {active:true})
                await confirm.remove();
                res.status(200).json({
                    ok: true,
                });
                return;
            }else{
                res.status(422).json({
                    ok: false,
                    error: "Invalid Token"
                });
            }
        }
    } catch (error) {
        res.status(422).json({
            ok: false,
            error: "Invalid Data"
        });
        return;
    };
});

router.post('/resend-code', async ( req, res ) =>{
    try {
        let digits = Math.floor(100000 + Math.random() * 900000);

        let numero = digits.toString();
        
        var mailOptions = {
            from: `Cryptobanco <${process.env.EMAIL_USER}>`,
            to: req.body.email,
            subject: 'Verify Account',
            html: `
                <div style="text-align: center; margin: 5px;">
                    <h2>This is the code to verify your account</h2><br/>
                    <span style="font-size: 45px; font-weight: bold;">${numero[0]}-${numero[1]}-${numero[2]}  ${numero[3]}-${numero[4]}-${numero[5]}</span>
                </div>
            `
        };

        transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
                res.status(400).json({
                    ok: false,
                    error
                })
                return;
            } else {
                await Confirm.findOneAndUpdate({email: req.body.email},{token: digits, createdAt: Date.now()})
                res.status(200).json({
                    ok: true
                })
                return;
            }
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            error: "Unknown error"
        });
        return;
    };
});
//------VERIFY ACCOUNT-------


module.exports = router;