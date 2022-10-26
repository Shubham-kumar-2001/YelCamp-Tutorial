if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

console.log(process.env.CLOUDIANRY_SECRET);
console.log(process.env.CLOUDIANRY_KEY);
console.log(process.env.CLOUDIANRY_CLOUD_NAME);

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ErrorHandler/ExpressError");
const Joi = require("joi");
// const { campgroundSchema, reviewSchema } = require("./ValidateCampground/schema")
// const catchAsyanc = require("./ErrorHandler/catchAsyanc")
// const Campground = require("./models/campground")
// const Review = require("./models/review")
const User = require("./models/user");
const passport = require("passport");
const locatStrategy = require("passport-local");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const session = require("express-session");
mongoose
  .connect("mongodb://localhost:27017/YelCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Yes I can establish the connection");
  })
  .catch((error) => {
    console.log("OH NO WHAT I MAKE MISTAKE MONGOOES IS NOT WORKING");
    console.log(error);
  });

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionOption = {
  secret: "smynameisshubham",
  resave: false,
  saveUninitialized: true,
  cookie: {
    HttpOnly: true,
    expires: Date.now() + 7 * 24 * 3600 * 1000,
    maxAge: 7 * 24 * 3600 * 1000,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new locatStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.warning = req.flash("warning");
  res.locals.rating = req.flash("rating");
  res.locals.danger = req.flash("danger");
  res.locals.error = req.flash("error");
  next();
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { satatusCode = 500 } = err;
  if (!err.message) err.message("OH,NO SOMETHING WENT WRONG");
  res.status(satatusCode).render("Error/error", { err });
});

app.listen(3030, () => {
  console.log("LISTENING ON PORT 3030");
});
