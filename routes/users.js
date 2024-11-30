const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../database");

const { check, validationResult } = require("express-validator");

// Helper functions
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    // Redirect to the login page if not logged in
    res.redirect("./users/login");
  } else {
    next();
  }
};

router.get("/login", function (req, res, next) {
  res.render("login.ejs");
});

router.post("/loggedin", function (req, res, next) {
  // parse username to lookup password
  let username = req.body.username;
  // SQL query to be executed for lookup based on username
  let sqlquery = "SELECT password FROM users WHERE username = ?";

  // Get password from the database
  db.query(sqlquery, [username], (err, results) => {
    if (err) {
      return next(err); // Pass the error to the error handler
    }

    if (results.length === 0) {
      // No user found
      return res.status(401).json({ message: "User not found" });
    }

    const hashedPassword = results[0].password;

    // Compare the provided password with the hashed password from the database
    bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
      if (err) {
        return next(err); // Pass the error to the error handler
      } else if (result === true) {
        // go in here if Passwords match
        // Save user session here, when login is successful
        req.session.userId = req.body.username;
        res.status(200).redirect("/fridge");
      } else {
        // Passwords don't match
        res.status(401).send("<h1>Invalid username or password<h1>");
      }
    });
  });
});

router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

router.post(
  "/registered",
  [check("email").isEmail(), check("password").isLength({ min: 8 })],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect("./register");
    } else {
      // prepare salt rounds for hashing
      const saltRounds = 10;
      // parse password from form to hash
      const plainPassword = req.body.password;
      // hash password
      bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        // Store hashed password in your database.
        // sql query to be executed to input form data into db
        let sqlquery =
          "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)";
        // parse user form data
        let newUser = [
          req.body.username,
          req.sanitize(req.body.firstname),
          req.body.lastname,
          req.body.email,
          hashedPassword,
        ];
        db.query(sqlquery, newUser, (err, result) => {
          if (err) {
            next(err);
          }
          // saving data in database
          else
            result =
              "Hello " +
              req.body.firstname +
              " " +
              req.body.lastname +
              " you are now registered!  We will send an email to you at " +
              req.body.email;
          result +=
            "Your password is: " +
            req.body.password +
            " and your hashed password is: " +
            hashedPassword;

          res.send(result);
        });
      });
    }
  }
);

router.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./");
    }
    res.send("you are now logged out.");
  });
});

module.exports = router;
