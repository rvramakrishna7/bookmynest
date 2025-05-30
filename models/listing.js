const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : v,
    },
  },
  country: {
    type: String,
  },
  location: {
    type: String,
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
