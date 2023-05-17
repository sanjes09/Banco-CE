const jwt = require('jsonwebtoken');

exports.decodeToken = (token, key) => {
    let response = {};
    jwt.verify(token, key, async (err, decoded) => {
        if (err) {
            response.error = err.name
        }else{
            response.data = decoded.userID
        };
    });
    return response;
}