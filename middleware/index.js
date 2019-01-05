const User = require("../models/user"),
    Group = require("../models/group");



// all middleware goes here
const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.redirectTo = req.originalUrl;
    req.flash("error", "You need to be logged in first"); // add a one-time message before redirect
    res.redirect("/login");
};

middlewareObj.checkGroupOwenership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Group.findById(req.params.id, (err, foundGroup) => {
            if (err || !foundGroup) {
                req.flash("error", "Group not found");
                res.redirect("back");
            } else {
                // does the user own the campground
                if (foundGroup.author.id.equals(req.user._id) || req.user.isAdmin) { next(); }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};



module.exports = middlewareObj;