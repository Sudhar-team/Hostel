const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Kitchen = require("../models/kitchen"),
    Feedback = require("../models/feedback"),
    middleware = require("../middleware");
// root route
router.get('/', (req, res) => res.render("home"));


router.get('/list', middleware.isLoggedIn, (req, res) => {
    Kitchen.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("kitchen", { list: list });
        }
    });
});


router.get("/add", middleware.isLoggedIn, (req, res) => res.render("add"));
// handle sign up logic
router.post("/add", middleware.isLoggedIn, (req, res) => {

    var item = req.body.item;
    var amount = req.body.amount;
    var quantity = req.body.quantity;
    var unit = req.body.unit;
    var price = req.body.price;
    var category = req.body.category;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newItem = { item: item, amount: amount, quantity: quantity, unit: unit, price: price, category: category, author: author }
    Kitchen.create(newItem, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", newItem.item + " is successfully added");
            res.redirect("/");
        }
    })
});

router.get("/:id/edit", function (req, res) {
    Kitchen.findById(req.params.id, function (err, foundItem) {
        res.render("edit", { item: foundItem });
    });
});

router.put("/:id", function (req, res) {

    Kitchen.findByIdAndUpdate(req.params.id, req.body.item, function (err, updatedItem) {
        if (err) {
            console.log(err);
            res.redirect("/list");
        } else {
            //redirect somewhere(show page)
            console.log(updatedItem);
            res.redirect("/list");
        }
    });
});

router.delete("/:id", function(req, res){
       Kitchen.findByIdAndRemove(req.params.id, function(err){
          if(err){
            console.log(err);
              res.redirect("/list");
          } else {
              res.redirect("/list");
          }
       });
    });


router.get("/register", (req, res) => res.render("register"));
// handle sign up logic
router.post("/register", (req, res) => {
    let newUser = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email
    });

    if (req.body.adminCode === 8080) {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            if (err.email === 'MongoError' && err.code === 11000) {
                // Duplicate email
                req.flash("error", "That email has already been registered.");
                return res.redirect("/register");
            }
            // Some other error
            req.flash("error", "Something went wrong...");
            return res.redirect("/register");
        }

        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to Dhikr " + user.username);
            res.redirect("/");
        });
    });
});


// show login form
router.get("/login", (req, res) => res.render("login", { page: "login" }));

// login logic: app.post("/login", middleware, callback)
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect('/login');
        }
        req.logIn(user, err => {
            if (err) { return next(err); }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
            delete req.session.redirectTo;
            req.flash("success", "Good to see you again, " + user.username);
            res.redirect(redirectTo);
        });
    })(req, res, next);
});

// logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out successfully. Looking forward to seeing you again!");
    res.redirect("/");
});



router.get("/feedback", (req, res) => res.render("feedback"));


router.post("/feedbacks", (req, res) => {

    var names = req.body.names;
    var phones = req.body.phone;
    var email = req.body.email;
    var texts = req.body.texts;
    var newFeedback = { names: names, Phone: phones, email: email, feedback: texts}
    Feedback.create(newFeedback, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", newItem.item + " Thankyou for submitting feedback!!");
            res.redirect("/");
        }
    })
});


router.get('/feedbacklist', (req, res) => {
    Feedback.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("feedbacklist", { list: list });
        }
    });
});

module.exports = router;