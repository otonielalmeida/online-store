const express = require('express');
const router = require('express').Router();
router.use(express.static('views'));

//models
const Post = require('../model/Post');
const CartProduct = require('../model/CartProduct');
const { verify } = require('jsonwebtoken');


router.get('/', async (req, res) => {
    var user = req.cookies.username;
    var userID = req.cookies.userID;
    //finding user's products saved in cart based on the userID
    const cartRegistry = await CartProduct.find({ User: userID });
    const productID = cartRegistry.map(x => x.ProductId);
    const quantity = cartRegistry.map(x => ({ quantity: x.Quantity, id: x.ProductId }));
    var product = await Post.find({ _id: productID });

    const prodObj = [];

    for (let i = 0; i < product.length; i++) {
        for (let j = 0; j < cartRegistry.length; j++) {
            if (cartRegistry[j].ProductId === (product[i]._id.toString())) {
                
                var prod = []
                prod.product = (product[i])
                prod.description = cartRegistry[j].Quantity;
                
                prodObj.push(prod);
              
            }
        }
    }

    console.log(prodObj)
    res.render('cart.ejs', {
        "user": user,
        "prodObj": prodObj
    });
});

router.get('/delete/:id', verify, async (req, res) => {
    await CartProduct.findOneAndDelete({ ProductId: req.params.id, User: req.cookies.userID });
    res.redirect('/cart');
});

module.exports = router;
