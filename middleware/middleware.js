const {
  reviewSchema,
  campgroundSchema,
} = require("../ValidateCampground/schema");
const ExpressError = require("../ErrorHandler/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
// const {reviewSchema} = require("../validateSchema/schema")
// const { campgroundSchema } = require("../ValidateCampground/schema")

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed first");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You dont have a Permission!!");
    res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};

module.exports.reviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You dont have a Permission!!");
    res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};
