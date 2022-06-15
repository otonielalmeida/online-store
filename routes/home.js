const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');

const Post = require('./../model/Post');
const User = require('../model/User');
const CartProduct = require('../model/CartProduct');
const { redirect } = require('express/lib/response');

const verify = require('./verifyToken');
router.use(express.static('views'));

router.get ('/', async (req, res) => {
    console.log(req.cookies)
    var loadPosts = await Post.find();
    var user = req.cookies.username;
    res.render('home.ejs', {
        "loadPosts": loadPosts,
        "user": user
    });
    
});

router.get('/product/:id', async (req, res) => {
    individualProduct = await Post.findById({_id: req.params.id});
    var user = req.cookies.username;
    var userID = req.cookies.userID;
    console.log(req.cookies)
    res.render('individualPage.ejs', {
        "individualProduct": individualProduct,
        "user": user,
        "userID": userID
    })
    
});
router.post('/product/:id', async (req, res) => {
    individualProduct = await Post.findById({_id: req.params.id});
    const cartProduct = new CartProduct({
        ProductId: individualProduct._id,
        Quantity: req.body.quantity,
        User: req.cookies.userID,
    });

    try{
        const savedCartProduct = await cartProduct.save();
        res.redirect('/');
    } catch (error){
        res.status(400).send(error);
    }
});

router.get('/delete/:id', verify, async (req, res) => {
    await Post.findByIdAndDelete({_id: req.params.id});
    res.redirect('/manageProducts');
    }
);

router.get('/logout', async (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("username");
    res.clearCookie("userID");
    res.redirect('/');
});

module.exports = router;
