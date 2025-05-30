const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing");
const Review = require("./models/review");


// Authentication Middleware


const isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to do that.");
    return res.redirect("/login");
  }
  next();
};

// Save Redirect URL (used after login)
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Validation Middleware

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// Authorization Middleware


const isOwnerListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing || !listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to modify this listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review || !review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to modify this review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports = {
  isLoggedin,
  saveRedirectUrl,
  validateListing,
  validateReview,
  isOwnerListing,
  isReviewAuthor,
};
