const express = require('express');
const router = require('express').Router();
router.use(express.static('views'));
const verify = require ('./verifyToken');

const Post = require('../model/Post');

router.get('/', verify, async (req, res) => {
    if (req.cookies.admin){
        var user = req.cookies.username;
        var loadPosts = await Post.find()
            .sort()
        res.render('manageProducts.ejs', {
            "loadPosts": loadPosts,
            "user": user
        });
    } else{
        res.redirect('/');
    }
    

});

module.exports = router;
