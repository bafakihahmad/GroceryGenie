// imports
const express = require("express");
const router = express.Router();
const db = require("../database");
const request = require("request");
const path = require("path");

// import helper function
const { getIngredientsForUser, getUserIdByUsername } = require(path.join(
  __dirname,
  "../",
  "utils",
  "fridgeUtils.js"
));

// Helper functions
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    // Redirect to login page if not logged in already
    res.redirect("/users/login");
  } else {
    // mover to next middleware otherwise
    next();
  }
};

// recipes route hanlder
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
        let apiKey = "fc82207cd69e40089676617701df410d";
        // create query by concatinating user ingredients and parsing it into url
        function createQuery(arr) {
          let query = "";
          if (arr.length == 0) return;
          query += ingredients[0];
          // loop through remaining elements to form query
          for (let i = 1; i < arr.length; i++) {
            query += ",+" + arr[i];
          }

          return query;
        }
        let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${createQuery(
          ingredients
        )}&apiKey=${apiKey}&ignorePantry=false&number=12`;
        // fetch data from api using formed query
        request(url, function (err, response, body) {
          if (err) {
            next(err);
          } else {
            try {
              // Parse the response body
              const recipes = JSON.parse(body);

              // Transform recipes to include only necessary fields
              const formattedRecipes = recipes.map((recipe) => ({
                title: recipe.title,
                image: recipe.image,
                usedIngredients: recipe.usedIngredients.map((ing) => ing.name),
                missedIngredients: recipe.missedIngredients.map(
                  (ing) => ing.name
                ),
              }));

              // pass the formatted recipes parsed from the JSON file and render the page
              res.render("recipes.ejs", { recipes: formattedRecipes });
            } catch (parseError) {
              console.error("Error parsing API response:", parseError);
              res.status(500).send("Error fetching recipes.");
            }
          }
        });
      }
    });
  });
});

module.exports = router;
