// Load environment variables in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Core Modules & Setup
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const https = require("https");

// Models & Routes
const User = require("./models/user");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

// MongoDB Configuration
const DBUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/bookmynest";

mongoose.connect(DBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: false,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

// View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
const store = MongoStore.create({
  mongoUrl: DBUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // 1 day
});

store.on("error", (err) => {
  console.log("❌ Mongo session store error:", err);
});

app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
}));

app.use(flash());

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & User Info for Views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/review", reviewRoutes);
app.use("/", userRoutes);

// HTTPS agent fix for some environments
https.globalAgent.options.secureProtocol = "TLSv1_2_method";

// Root Redirect
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// 404 Handler
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const { statusCode = 500 } = err;
  err.message ||= "Something went wrong!";
  res.status(statusCode).render("./listings/error.ejs", { err });
});

// Server Start
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
