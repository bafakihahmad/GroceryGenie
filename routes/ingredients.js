// imports
const express = require("express");
const router = express.Router();
const db = require("../database");

// Helper functions
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    // Redirect to login page if not logged in already
    res.redirect("./users/login");
  } else {
    // mover to next middleware otherwise
    next();
  }
};

router.get("/", redirectLogin, function (req, res, next) {
  res.render("ingredients.ejs", { ingredients: [] });
});

router.post("/search", function (req, res, next) {
  // sanitize and parse user query
  ingredient = req.sanitize(req.body.ingredient);
  value = [`%${ingredient}%`];
  // create sql query
  sqlQuery = "SELECT ingredient FROM ingredients WHERE ingredient LIKE ?";
  // execute query
  db.query(sqlQuery, value, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      // format as 1D array rather than 2D array
      formattedResult = result.map((row) => row.ingredient);
      //console.log(result);
      console.log(formattedResult);
      res.render("ingredients.ejs", { ingredients: formattedResult });
    }
  });
});

module.exports = router;
