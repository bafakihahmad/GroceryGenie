// npm package imports
let express = require("express");
let ejs = require("ejs");
let path = require("path");
const db = require("./database.js");

// create express app
let app = express();

// pass in path of folder we want to serve staticlly
app.use(express.static(path.join(__dirname, "public")));

// Tell Express that we want to use EJS as the templating engine
app.set("view engine", "ejs");

// Load the route handlers for /main
const mainRoutes = require("./routes/main");
app.use("/", mainRoutes);

// Load the route handlers for /users
const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);

app.get("/fridge", function (req, res, next) {
  res.render("fridge.ejs");
});

let port = 8000;
app.listen(port, () => console.log(`GroceryGenie listening on port ${port}!`));
