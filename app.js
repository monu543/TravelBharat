if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

const usersRouter = require("./routes/users");
const listingsRouter = require("./routes/listings");

const dbUrl = process.env.ATLASDB_URL;

// DATABASE CONNECTION
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

// VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SESSION
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
};

app.use(session(sessionOptions));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// CURRENT USER
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

// ROUTES
app.use("/", usersRouter);
app.use("/listings", listingsRouter);

// HOME ROUTE
app.get("/", (req, res) => {
    res.redirect("/listings");
});

//ERROR HANDLER
app.use((err, req, res, next) => {
    console.log("===== ERROR =====");
    console.log(err);

    res.status(500).send("Something went wrong!");
});

// SERVER
// SERVER

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});