const path = require("path");
const db = require(path.join(__dirname, "../", "database.js"));

const getUserIdByUsername = (username, callback) => {
  // SQL query to get the users_id based on username
  const query = "SELECT users_id FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return callback(err, null);
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

const getIngredientsForUser = (userId, callback) => {
  const sqlQuery = `
      SELECT i.ingredient 
      FROM fridge f
      JOIN ingredients i ON f.ingredient_id = i.ingredient_id
      WHERE f.users_id = ?;
    `;

  db.query(sqlQuery, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    // Extract the ingredients into an array
    const ingredients = results.map((row) => row.ingredient);
    // Pass the array to the callback
    callback(null, ingredients);
  });
};

module.exports = {
  getUserIdByUsername,
  linkIngredientToUser,
  getIngredientsForUser,
};
