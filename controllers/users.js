const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup");
};

module.exports.signUpNewUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash(
        "success",
        "Welcome to Bookmynest! Your account has been created successfully."
      );
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", "That username is already taken. Please choose another.");
    return res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login");
};

module.exports.authenticateUser = async (req, res) => {
  req.flash(
    "success",
    "Welcome back! You have logged in successfully."
  );
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Oops! Something went wrong while logging out.");
      return next(err);
    }
    req.flash("success", "You have logged out successfully. See you again soon!");
    res.redirect("/listings");
  });
};
