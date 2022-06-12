const express = require('express');
const router = require('express').Router();
router.use(express.static('views'));

//models
const Post = require ('../model/Post');
const CartProduct = require('../model/CartProduct');
const { verify } = require('jsonwebtoken');


router.get ('/', async (req, res) => {
    var user = req.cookies.username;
    var userID = req.cookies.userID;
    //finding user's products saved in cart based on the userID
    const cartRegistry = await CartProduct.find({User: userID});
    const productID = cartRegistry.map(x => x.ProductId );
    const quantity = cartRegistry.map(x => ({quantity : x.Quantity, id : x.ProductId}));
    var product = await Post.find({_id: productID});
   
    const prodObj = [];    
    
    for (let i = 0; i < product.length; i++){
        for (let j = 0; j < cartRegistry.length; j++){
            if ( cartRegistry[j].ProductId === (product[i]._id.toString()) ){
               
               var prod = product[i]
               prod.description = parseInt(cartRegistry[j].Quantity);
               
               prodObj.push(prod);
            }
            /* console.log(quantity[i].id === product[j]._id.toString()) */
        }
        console.log(prodObj)
    }
 

    
    res.render('cart.ejs', {
        "product": product, 
        "quantity": quantity,
        "user": user,
        "prodObj": prodObj
    });
});

router.get ('/delete/:id', verify, async (req, res) => {
    await Post.findByIdAndDelete({_id: req.params.id});
    res.redirect('/cart');
})

module.exports = router;
