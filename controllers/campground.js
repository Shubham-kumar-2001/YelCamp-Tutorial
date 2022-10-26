const { cloudinary } = require("../cloudinary")
const Campground = require("../models/campground")



module.exports.index = async (req, res) => {
    const campground = await Campground.find({})
    res.render("campground/index", { campground })
}

module.exports.renderNewForm = (req, res) => {
    res.render("campground/new")
}

module.exports.createCampgrounds = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("You have done blander mistake", 400)
    const campground = new Campground(req.body.campground)
    campground.images  = req.files.map(f =>({url:f.path,filename : f.filename}))
    campground.author = req.user._id
    await campground.save();
    console.log(campground)
    req.flash("success", "Hey! You Successfully Create a New Campgrounds")
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.showCampgroundsPage = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    // console.log(campground)
    if (!campground) {
        req.flash("error", "Hey!!! This Campgrond does not Exit")
        return res.redirect("/campgrounds")
    }
    res.render("campground/show", { campground })
}

module.exports.showReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    res.render("campground/review", { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "Hey!!! This Campgrond does not Exit")
        return res.redirect("/campgrounds")
    }
    res.render("campground/edit", { campground })
}

module.exports.updateCampgrounds = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true })
    const imgs  = req.files.map(f =>({url:f.path,filename : f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        console.log("body",req.body.deleteImages)
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.update({ $pull: { images:{filename:{$in: req.body.deleteImages}}}} )
        console.log(campground)
    }
    req.flash("warning", "Hey! You Successfully Edit the Campgrounds")
    res.redirect(`/campgrounds/${id}`)
}




module.exports.deleteCampgrounds = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id)
    req.flash("danger", "Hey! You Successfully Delete Campgrounds")
    res.redirect("/campgrounds")
}