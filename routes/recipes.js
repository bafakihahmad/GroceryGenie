// imports
const express = require("express");
const router = express.Router();
const db = require("../database");

// Helper functions
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    // Redirect to the login page if not logged in
    res.redirect("./users/login");
  } else {
    next();
  }
};

router.get("/", redirectLogin, function (req, res, next) {
  res.render("recipes.ejs");
});

module.exports = router;
