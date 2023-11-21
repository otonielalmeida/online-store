const express = require("express");
const router = require("express").Router();
router.use(express.static("views"));

//models
const Post = require("../model/Post");
const CartProduct = require("../model/CartProduct");
const { verify } = require("jsonwebtoken");

router.get("/", async (req, res) => {
  var user = req.cookies.username;
  var userID = req.cookies.userID;
  //finding user's products saved in cart based on the userID
  const cartRegistry = await CartProduct.find({ User: userID });
  /* const productID = cartRegistry.map((x) => x.ProductId);
  const quantity = cartRegistry.map((x) => ({
    quantity: x.Quantity,
    id: x.ProductId,
  })); */

  var prod_list = [];

  for (let j = 0; j < cartRegistry.length; j++) {
    var product = await Post.find({ _id: cartRegistry[j].ProductId });

    product[0]._id = product[0]._id.toString().split(`"`);

    product[0].description = cartRegistry[j].Quantity;

    prod_list.push(product[0]);
  }

  res.render("cart.ejs", {
    user: user,
    prodObj: prod_list,
  });
});

router.get("/delete/:id", verify, async (req, res) => {
  await CartProduct.findOneAndDelete({
    ProductId: req.params.id,
    User: req.cookies.userID,
  });
  res.redirect("/cart");
});

module.exports = router;
