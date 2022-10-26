const User = require("../models/user")


module.exports.renderRegister = (req, res) => {
    res.render("userAuth/register")
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username });
        const userpass = await User.register(user, password);
        req.login(userpass, (err) => {
            if (err) return next(err);
            req.flash("success", "WelDone You Successfully Register to Campgrounds")
            const registerUrl = req.session.returnTo || "/campgrounds"
            res.redirect(registerUrl)
        })


    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}

module.exports.renderLogin =  (req, res) => {
    res.render("userAuth/login")
}


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back to Campgrounds")
    const redirectUrl = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("error", "Hey!! You Logout from Campgrounds")
    res.redirect("/campgrounds")
}