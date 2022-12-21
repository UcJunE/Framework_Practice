const express = require("express");
const router = express.Router();
const crypto = require("crypto");

//function that wil hash the password
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

//import in user Model from model
const { User } = require("../models");

// import in form
const {
  createRegistrationForm,
  bootStrapField,
  createPosterForm,
  createLoginForm,
} = require("../forms");
const async = require("hbs/lib/async");

router.get("/register", (req, res) => {
  //display register form
  const registerForm = createRegistrationForm();
  res.render("users/register", {
    form: registerForm.toHTML(bootStrapField),
  });
});

//create a post route to handle data input from user
router.post("/register", (req, res) => {
  const registerForm = createRegistrationForm();
  registerForm.handle(req, {
    success: async (form) => {
      const user = new User({
        username: form.data.username,
        password: getHashedPassword(form.data.password),
        email: form.data.email,
      });
      await user.save();
      req.flash("success_messages", "User signed up successfully !");
      res.redirect("/users/login");
    },
    error: (form) => {
      res.render("users/register", {
        form: form.toHTML(bootStrapField),
      });
    },
  });
});

router.get("/login", (req, res) => {
  const loginForm = createLoginForm();
  res.render("users/login", {
    form: loginForm.toHTML(bootStrapField),
  });
});

//route to handle user login
router.post("/login", (req, res) => {
  const loginForm = createLoginForm();
  loginForm.handle(req, {
    success: async (form) => {
      let user = await User.where({
        email: form.data.email,
      }).fetch({
        require: false,
      });
      if (!user) {
        req.flash(
          "error_messages",
          "Sorry , the authentication details you provided does not work"
        );
        res.redirect("/users/login");
      } else {
        //check if the password is matched, 1st check the email
        if (user.get("password") === getHashedPassword(form.data.password)) {
          //add to session because the login succeed and store the user details
          // to store the user details
          req.session.user = {
            id: user.get("id"),
            username: user.get("email"),
            email: user.get("email"),
          };
          req.flash(
            "success_messages",
            "Welcome Back ," + user.get("username")
          );
          res.redirect("/users/profile");
        } else {
          req.flash("error_messages", "Sorry WRONG PASSSWORDDDDD");
          res.redirect("/users/login");
        }
      }
    },
    error: (form) => {
      req.flash(
        "error_messages",
        "There are some problem logging you in . Please fill in the form again"
      );
      res.render("users/login", {
        form: form.toHTML(bootStrapField),
      });
    },
  });
});

//add profile route
router.get("/profile", (req, res) => {
  const user = req.session.user;
  if (!user) {
    req.flash("error_messages", "You do not have permission to view this page");
    res.redirect("/users/login");
  } else {
    res.render("users/profile", {
      user: user,
    });
  }
});

//create a logout route
router.get("/logout", (req, res) => {
  req.session.user = null;
  req.flash("success_messages", "GoodBye");
  res.redirect("/users/login");
});

module.exports = router;
