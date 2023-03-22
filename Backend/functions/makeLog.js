const Log = require("../models/Log");

exports.makeLog = (data) =>{
    return new Promise( async ( succ, error ) => {
        try {
            let log = new Log();
            log.data = data;
            await log.save();
            succ();
        } catch (error) {
            error();
        }
    });
};