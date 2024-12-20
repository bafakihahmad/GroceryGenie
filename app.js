// npm package imports
let express = require("express");
let ejs = require("ejs");
let path = require("path");
let db = require("./database.js");
let session = require("express-session");
let validator = require("express-validator");
let expressSanitizer = require("express-sanitizer");

// create express app
let app = express();

// pass in path of folder we want to serve staticlly
app.use(express.static(path.join(__dirname, "public")));

// Tell Express that we want to use EJS as the templating engine
app.set("view engine", "ejs");

// Set up express built in body parser
app.use(express.urlencoded({ extended: true }));

// Create an input sanitizer
app.use(expressSanitizer());

// Create a session (placed before routes - ensures it is applied to all incoming requests)
app.use(
  session({
    secret: "somerandomstuff",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

app.use((req, res, next) => {
  // Make the userId available to all templates
  // necessary to check session state for dynamic changes to the UI
  res.locals.userId = req.session.userId || null;
  next();
});

// Load the route handlers for /main
const mainRoutes = require("./routes/main");
app.use("/", mainRoutes);

// Load the route handlers for /users
const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);

// Load the route handlers for /fridge
const fridgeRoutes = require("./routes/fridge");
app.use("/fridge", fridgeRoutes);

// Load the route handlers for /recipes
const recipesRoutes = require("./routes/recipes");
app.use("/recipes", recipesRoutes);

// Load the route handlers for /api
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Load the route handlers for /ingredients
const ingredientsRoutes = require("./routes/ingredients");
app.use("/ingredients", ingredientsRoutes);

let port = 8000;
app.listen(port, () => console.log(`GroceryGenie listening on port ${port}!`));
