const jwt = require('jsonwebtoken');
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());

module.exports = function (req, res, next){
    const token = req.cookies.jwt;
    if(!token) return res.redirect('/');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();        
    } catch (err) {
        res.redirect('/');
    }
}
