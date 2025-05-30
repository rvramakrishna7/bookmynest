const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { storage } = require("../cloudConfig");
const {
  isLoggedin,
  validateListing,
  isOwnerListing,
} = require("../middleware");
const listingController = require("../controllers/listings");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.listings))
  .post(
    validateListing,
    isLoggedin,
    upload.single("listing[image][url]"),
    wrapAsync(listingController.createListing)
  );

// NEW Form for Listing
router.get("/new", isLoggedin, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .patch(
    validateListing,
    isLoggedin,
    isOwnerListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedin,
    isOwnerListing,
    wrapAsync(listingController.destroyListing)
  );

// EDIT Form for Listing
router.get(
  "/:id/edit",
  isLoggedin,
  isOwnerListing,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
