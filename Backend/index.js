//IMPORTS
require("dotenv").config();
require("./database");
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const cors = require("cors");
const compression = require('compression');
const { decodeToken } = require('./functions/token');

//CONFIG
const app = express();
const limit = rateLimit({
    max: 1000,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout 
    message: 'Too many requests, you are locked for 1hr' // message to send
});

//MIDDELWARES
app.use(express.urlencoded({extended: true ,limit: '1mb'}))
app.use(express.static(path.join(__dirname,'public'), {
	dotfiles: 'allow',
	maxage: 31557600000,
	setHeaders: function(res, path) {
		res.setHeader("Expires", new Date(Date.now() + 2592000000*30).toUTCString());
	}
}));
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(compression());
app.use(xss());
app.use(helmet());
app.use( '*', limit);
app.use(cors());
app.options("*", cors());

//ROUTERS
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

const appRouter = require('./routes/app');
app.use('/api/app', async ( req, res, next ) => {
    const token = req.header("Authorization");
    if (!token){
        res.status(401).json({ 
            ok: false,
            error: 'Not logged in'
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
            res.locals.user = response.userID;
            next();
        }
    }
});
app.use( '/api/app', appRouter);
// ROUTERS

app.get('*.js', (req, res) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
	res.set("Expires", new Date(Date.now() + 2592000000*30).toUTCString());
    res.sendFile(path.join(__dirname,'/public'+req.url));
});

app.get('*.css', (req, res) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
	res.set("Expires", new Date(Date.now() + 2592000000*30).toUTCString());
    res.sendFile(path.join(__dirname,'/public'+req.url));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'));
    return;
});

//CONNECTION
app.listen(process.env.PORT,() => {
    console.log(`env running on port ${process.env.PORT}`);
});