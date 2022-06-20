const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');

const Post = require('./../model/Post');
const User = require('../model/User');
const CartProduct = require('../model/CartProduct');
const HomeProduct = require('../model/HomeProduct.js');
const Favorites = require('../model/Favorites');

const { redirect } = require('express/lib/response');

const verify = require('./verifyToken');
router.use(express.static('views'));

router.get ('/', async (req, res) => {
    const homeProd= await HomeProduct.find();
    var homeProducts = homeProd.map(x => x.ProductId)
    
    var loadPosts = await Post.find({_id: homeProducts});
    
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

router.get('/favorites/', verify, async (req, res) => {
    var user = req.cookies.username;
    var userID = req.cookies.userID;
    var favoriteProd = await Favorites.find({ User: userID });
    var favIdObj = [];
    for (i = 0; i < favoriteProd.length; i++){
        var prodID = []
       
        var product = await Post.findById({_id: favoriteProd[i].ProductId});
        favIdObj.push(product);
    }
    
    prodObj = favIdObj;
    console.log(prodObj)
    res.render('favorites.ejs', {
        "user": user,
        "userID": userID,
        "prodObj": prodObj
    });
});

router.get('/delete/:id', verify, async (req, res) => {
    await Post.findByIdAndDelete({_id: req.params.id});
    res.redirect('/manageProducts');
    }
);

router.get('/addToHomePage/:id', verify, async (req, res) => {
    const product = new HomeProduct({
        ProductId: req.params.id
    });
    try {
        const savedProduct = await product.save();
        res.redirect('/manageProducts');
    } catch (e) {
        console.log(e);
    }
    }
);

router.get('/deleteFromHomePage/:id', verify, async (req, res) => {
    await HomeProduct.findOneAndDelete({ProductId: req.params.id });
    res.redirect('/manageProducts');
    }
);

router.get('/addToFavorites/:id', verify, async (req, res) => {
    const product = new Favorites({
        ProductId: req.params.id,
        User: req.cookies.userID
    });
    try{
        const savedFavorites = await product.save();
        res.redirect('/');
    } catch(e) {
        console.log(e);
    }
});

router.get('/deleteFromFavorites/:id', verify, async (req, res) => {
    await Favorites.findOneAndDelete({ProductId: req.params.id });
    res.redirect('/favorites');
    }
);

router.get('/logout', async (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("username");
    res.clearCookie("userID");
    res.clearCookie("admin");
    res.redirect('/');
});

module.exports = router;
