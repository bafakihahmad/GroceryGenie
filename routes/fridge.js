// imports
const express = require("express");
const path = require("path");
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

// import fridge helper functions
const {
  getUserIdByUsername,
  linkIngredientToUser,
  getIngredientsForUser,
} = require(path.join(__dirname, "../", "utils", "fridgeUtils.js"));

router.get("/", redirectLogin, function (req, res, next) {
  // Access username from session
  const username = req.session.userId;
  getUserIdByUsername(username, (err, userId) => {
    if (err) {
      console.error("Error fetching user ID:", err);
      return res
        .status(500)
        .send("An error occurred while fetching user data.");
    }

    if (!userId) {
      return res.status(404).send("User not found.");
    }

    getIngredientsForUser(userId, (err, ingredients) => {
      if (err) {
        console.error("Error fetching ingredients:", err);
      } else {
        //console.log("Ingredients for user:", ingredients);
        res.render("fridge.ejs", { username, ingredients });
      }
    });
  });
});

router.post("/add", function (req, res, next) {
  // Parse ingredient name from form
  const ingredient = req.body.ingredient;
  const username = req.session.userId;

  // Get the userId using the username
  getUserIdByUsername(username, (err, userId) => {
    if (err) {
      console.error("Error fetching user ID:", err);
      return res
        .status(500)
        .send("An error occurred while fetching user data.");
    }

    if (!userId) {
      return res.status(404).send("User not found.");
    }

    // check if the ingredient exists in Ingredients table
    const findIngredientQuery =
      "SELECT ingredient_id FROM ingredients WHERE ingredient = ?";
    db.query(findIngredientQuery, [ingredient], (err, ingredientResult) => {
      if (err) return next(err);

      if (ingredientResult.length > 0) {
        // Ingredient exists, get its ingredient_id
        const ingredientId = ingredientResult[0].ingredient_id;

        // Link ingredient to user (with duplicate check)
        linkIngredientToUser(userId, ingredientId, (err, result) => {
          if (err) return next(err);

          // handle case where ingredient is a duplicate
          if (result === "duplicate") {
            return res.status(409).send(`
              <script>
                alert("This ingredient is already in your fridge.");
                window.history.back();
              </script>
            `);
          }

          // Ingredient added, redirect to show updated list
          res.redirect("/fridge");
        });
      } else {
        // Ingredient doesn't exist, insert it into Ingredients table
        const insertIngredientQuery =
          "INSERT INTO ingredients (ingredient) VALUES (?)";
        db.query(insertIngredientQuery, [ingredient], (err, result) => {
          if (err) return next(err);

          const ingredientId = result.insertId; // Get the new ingredient ID

          // Link ingredient to user (with duplicate check)
          linkIngredientToUser(userId, ingredientId, (err, result) => {
            if (err) return next(err);

            if (result === "duplicate") {
              return res.status(409).send(`
                <script>
                  alert("This ingredient is already in your fridge.");
                  window.history.back();
                </script>
              `);
            }

            // Ingredient added, redirect to show updated list
            res.redirect("/fridge");
          });
        });
      }
    });
  });
});

router.post("/remove", function (req, res, next) {
  const username = req.session.userId;

  // use helper method to fetch users_id for querying database
  getUserIdByUsername(username, (err, userId) => {
    if (err) {
      console.error("Error fetching user ID:", err);
      return res
        .status(500)
        .send("An error occurred while fetching user data.");
    }

    if (!userId) {
      return res.status(404).send("User not found.");
    }

    // parse ingredient to delete from form
    let ingredientToDelete = req.body.removeIngredient;
    // execute sql query to delete said ingredient
    let sqlQuery =
      "DELETE FROM fridge WHERE ingredient_id = (SELECT ingredient_id FROM ingredients WHERE ingredient = ?) AND users_id = ?";
    db.query(sqlQuery, [ingredientToDelete, userId], (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.redirect("/fridge");
      }
    });
  });
});

module.exports = router;
