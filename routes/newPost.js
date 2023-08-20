const express = require("express");
const router = require("express").Router();
const verify = require("./verifyToken");
const multer = require("multer");

router.use(express.static("views"));

//model
const Post = require("./../model/Post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../views/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", verify, async (req, res) => {
  if (!req.cookies.admin) {
    res.redirect("/");
  } else {
    res.render("newPost.ejs");
  }
});

router.post("/", verify, upload.single("image"), async (req, res) => {
  const post = new Post({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    image: req.file.filename,
    brand: req.file.brand,
  });
  try {
    const SavedPost = await post.save();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
