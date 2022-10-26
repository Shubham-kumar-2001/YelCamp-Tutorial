const express = require("express");
const router = express.Router();

// const ExpressError = require("../ErrorHandler/ExpressError")
// const { campgroundSchema } = require("../ValidateCampground/schema")
const catchAsyanc = require("../ErrorHandler/catchAsyanc");

// const Campground = require("../models/campground")
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware/middleware");
const campground = require("../controllers/campground");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsyanc(campground.index))
  .post(
    isLoggedIn,
    upload.array("campground[images]"),
    validateCampground,
    catchAsyanc(campground.createCampgrounds)
  );

router.get("/new", isLoggedIn, campground.renderNewForm);

router
  .route("/:id")
  .get(catchAsyanc(campground.showCampgroundsPage))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("campground[images]"),
    validateCampground,
    catchAsyanc(campground.updateCampgrounds)
  )
  .delete(isLoggedIn, isAuthor, catchAsyanc(campground.deleteCampgrounds));

router.get("/:id/reviews", catchAsyanc(campground.showReview));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsyanc(campground.renderEditForm)
);

module.exports = router;
