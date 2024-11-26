let express = require("express");
let router = express.Router();
const db = require("../database");

// Helper functions
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("./users/login"); // Redirect to the login page if not logged in
  } else {
    next(); // Move to the next middleware function
  }
};

const linkIngredientToUser = (userId, ingredientId, callback) => {
  // Check if the user already has this ingredient in their fridge
  const checkFridgeQuery =
    "SELECT * FROM Fridge WHERE users_id = ? AND ingredient_id = ?";
  db.query(checkFridgeQuery, [userId, ingredientId], (err, result) => {
    if (err) return callback(err);

    if (result.length > 0) {
      // Ingredient already exists in the user's fridge
      return callback(null, "duplicate");
    }

    // If no result found, insert the ingredient into the fridge
    const userFridgeQuery =
      "INSERT INTO Fridge (users_id, ingredient_id) VALUES (?, ?)";
    db.query(userFridgeQuery, [userId, ingredientId], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

const getUserIdByUsername = (username, callback) => {
  // SQL query to get the user_id based on username
  const query = "SELECT users_id FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return callback(err, null); // Pass the error to the callback
    }

    if (results.length === 0) {
      // Handle case where no user is found
      return callback(null, null);
    }

    // Return the user_id of the found user (as an integer)
    const userId = results[0].users_id;
    callback(null, userId);
  });
};

router.get("/", redirectLogin, function (req, res, next) {
  // Access username from session
  const username = req.session.userId;
  res.render("fridge.ejs", { username });
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
      "SELECT ingredient_id FROM Ingredients WHERE ingredient = ?";
    db.query(findIngredientQuery, [ingredient], (err, ingredientResult) => {
      if (err) return next(err);

      if (ingredientResult.length > 0) {
        // Ingredient exists, get its ingredient_id
        const ingredientId = ingredientResult[0].ingredient_id;

        // Step 3: Link ingredient to user (with duplicate check)
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

          // Success: Ingredient added
          res.send(`
            <script>
              alert("Ingredient successfully added to your fridge!");
              window.location.href = "/";
            </script>
          `);
        });
      } else {
        // Ingredient doesn't exist, insert it into Ingredients table
        const insertIngredientQuery =
          "INSERT INTO Ingredients (ingredient) VALUES (?)";
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

            // Success: Ingredient added
            res.send(`
              <script>
                alert("Ingredient successfully added to your fridge!");
                window.location.href = "/";
              </script>
            `);
          });
        });
      }
    });
  });
});

module.exports = router;
