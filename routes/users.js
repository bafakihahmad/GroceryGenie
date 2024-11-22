let express = require("express");
const router = express.Router();

router.get("/login", function (req, res, next) {
  res.render("login.ejs");
});

router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

module.exports = router;
