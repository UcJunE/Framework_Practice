const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const csrf = require("csurf");
require("dotenv").config();
// cors must setup before sessions

// create an instance of express app
let app = express();

const session = require("express-session");

const flash = require("connect-flash");

const FileStore = require("session-file-store")(session);

//enable CSRF
app.use(csrf());

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash("error_messages", "The form has expired. Please try again");
    res.redirect("back");
  } else {
    next();
  }
});

// middleware to share the csrf token with all hbs files
app.use(function (req, res, next) {
  // for routes that are excluded from csrf, `req.csrfToken` will be undefined
  // so we need to check for the existence of the function first for the other routes
  if (req.csrfToken) {
    // req.csrfToken() will return a valid CSRF token
    // and we make it available to all hbs files via `res.locals.csrfToken`
    res.locals.csrfToken = req.csrfToken();
  }

  next();
});
//setup sessions
app.use(
  session({
    store: new FileStore(),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

//setup flash
app.use(flash());

//register flash middleware
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  //most important
  next();
});

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});
// import in routes
const landingRoutes = require("./routes/landing");
const posterRoutes = require("./routes/poster");
const userRoutes = require("./routes/users");

async function main() {
  app.use("/", landingRoutes);
  app.use("/posters", posterRoutes);
  app.use("/users", userRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});
