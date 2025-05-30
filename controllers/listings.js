const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.listings = async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "Success! Your new listing is now live.");
  res.redirect("./listings");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Sorry, the requested listing could not be found.");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const editListing = await Listing.findById(id);
  if (!editListing) {
    req.flash("error", "Sorry, the requested listing could not be found.");
    res.redirect("/listings");
  } else {
    res.render("./listings/edit.ejs", { editListing });
  }
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  await listing.save();
  req.flash("success", "Your listing has been updated successfully.");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  if (!Listing) {
    req.flash("error", "Listing does not exist.");
    return res.redirect("/listings");
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "The listing has been deleted successfully.");
  res.redirect("/listings");
};
