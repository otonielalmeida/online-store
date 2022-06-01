const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Post = require('./../model/Post');
const User = require('../model/User');
router.use(express.static('views'));

router.get ('/', async (req, res) => {
    console.log(req.cookies)
    var loadPosts = await Post.find();
    var user = req.cookies.user;
    res.render('home.ejs', {
        "loadPosts": loadPosts,
        "user": user
    });
    
});

router.get('/product/:id', async (req, res) => {
    individualProduct = await Post.findById({_id: req.params.id});
    var user = req.cookies.user;
    res.render('individualPage.ejs', {
        "individualProduct": individualProduct,
        "user": user
    })
    
});

router.get('/logout', async (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("user");
    res.redirect('/');
});

module.exports = router;
