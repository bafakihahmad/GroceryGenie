const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", function (req, res, next) {
  // query to return the ingredients column from the Ingredients table
  sqlQuery = "SELECT ingredient FROM Ingredients";
  // execute query
  db.query(sqlQuery, (err, result) => {
    if (err) {
      return next(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
