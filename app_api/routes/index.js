var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = jwt({
  // Lab 6
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
});

var ctrlBlogs = require("../controllers/blogs");
var ctrlAuth = require("../controllers/authentication");
var ctrlGame = require("../controllers/game");

router.get("/blogs", ctrlBlogs.blogsList);
router.post("/blogs", auth, ctrlBlogs.blogsCreateOne);
router.get("/blogs/:id", ctrlBlogs.blogsReadOne);
router.put("/blogs/:id", auth, ctrlBlogs.blogsUpdateOne);
router.delete("/blogs/:id", auth, ctrlBlogs.blogsDeleteOne);
router.post("/register", ctrlAuth.register); // Lab 6
router.post("/login", ctrlAuth.login); // Lab 6
router.post("/game", ctrlGame.gameCreateOne);
router.put("/game", ctrlGame.gameUpdateOne);
router.get("/game/:id", ctrlGame.gameRead);

module.exports = router;
