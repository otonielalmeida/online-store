const express = require('express');
const router = require('express').Router();
router.use(express.static('views'));
const verify = require ('./verifyToken');

const Post = require('../model/Post');

router.get('/', verify, async (req, res) => {
    var user = req.cookies.username;
    var loadPosts = await Post.find()
        .sort()
    res.render('manageProducts.ejs', {
        "loadPosts": loadPosts,
        "user": user
    });

});

module.exports = router;
