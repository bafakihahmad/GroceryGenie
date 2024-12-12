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

// Keep the connection alive with a periodic query
setInterval(() => {
  db.query("SELECT 1", (err) => {
    if (err) {
      console.error("Error keeping the database connection alive:", err);
    } else {
      console.log("Database connection kept alive.");
    }
  });
}, 300000); // Every 5 minutes

module.exports = db;
