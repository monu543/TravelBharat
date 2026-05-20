const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// SIGNUP FORM
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// SIGNUP USER
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                console.log(err);
                return res.send(err);
            }

            res.redirect("/listings");
        });

    } catch (e) {
        console.log(e);
        res.send(e.message);
    }
});

// LOGIN FORM
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// LOGIN USER
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
    }),
    (req, res) => {
        res.redirect("/listings");
    }
);

// LOGOUT
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/login");
    });
});

module.exports = router;