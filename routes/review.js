const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedin, validateReview, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");

//CREATE Review
router.post(
  "/",
  validateReview,
  isLoggedin,
  wrapAsync(reviewController.createReview)
);

//DESTROY Review
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
