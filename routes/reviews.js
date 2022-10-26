const express = require("express")
const router = express.Router({mergeParams : true});
const catchAsyanc = require("../ErrorHandler/catchAsyanc")
// const {reviewSchema } = require("../ValidateCampground/schema")
// const ExpressError = require("../ErrorHandler/ExpressError")
// const Review = require("../models/review")
// const Campground = require("../models/campground");
const {validateReview, isLoggedIn, reviewAuthor } = require("../middleware/middleware")
const reviews = require("../controllers/review")


router.post("/",isLoggedIn,validateReview,catchAsyanc(reviews.createReview))

router.delete("/:reviewId",isLoggedIn,reviewAuthor,catchAsyanc(reviews.deleteReview))


module.exports = router;