const express = require("express")
const router = express.Router()
// const User = require("../models/user")
const passport = require("passport")
const catchAsyanc = require("../ErrorHandler/catchAsyanc")
const {isLoggedIn} = require("../middleware/middleware")
// const ExpressError = require("../ErrorHandler/ExpressError")
const user = require("../controllers/user")

router.route("/register")
    .get(user.renderRegister )
    .post(catchAsyanc(user.register))

router.route("/login")
    .get(user.renderLogin)
    .post( passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), user.login)


router.get("/logout", user.logout)

module.exports = router;


