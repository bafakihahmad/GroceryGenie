// import mysql
let mysql = require("mysql2");

// Define the database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "appuser",
  password: "app2027",
  database: "groceryGenie",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});

module.exports = db;
