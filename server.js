if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
//db connection
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.log(error))
db.once("open", () => console.log("Connected to users database"))
const user = require("./db_schemes/user.js")
const excercises_list = require('./exercises.json')

var express = require("express")
var app = express()
const PORT = 3000;
const bcrypt = require("bcrypt")
const flash = require("express-flash")
const session = require("express-session")
const passport = require("passport")
const methodOverride = require("method-override")
const initializePassport = require("./passport-config")
initializePassport(
    passport,
    email => user.findOne({ email: email }),
    _id => user.findById(_id)
)


app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))
app.use(express.static('static_scripts'))


app.get('/', checkAuth, (req, res) => {
    res.render("index.ejs", { name: req.user.username });
})
app.get('/plan_builder', checkAuth, (req, res) => {
    res.render("plan_builder.ejs", { name: req.user.username });
})

app.get('/login', checkNotAuth, (req, res) => {
    res.render("login.ejs");
})
app.post('/login', checkNotAuth, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))
app.get('/register', checkNotAuth, (req, res) => {
    res.render("register.ejs");
})
app.get('/excercises_json', checkAuth, (req, res) => {
    res.header("Content-Type", 'application/json');
    res.send(excercises_list);
})
app.post('/register', checkNotAuth, async (req, res) => {
    req.body.username
    try {
        if (await user.exists({ email: req.body.email })) {
            req.flash("error", "Error: Email already in use");
            res.redirect('/register')
        } else {

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new user({
                email: req.body.email,
                name: req.body.name,
                password: hashedPassword
            })
            newUser.save((err) => {
                if (err)
                    console.log("error in adding to db")
                console.log("New user registered")
            });

            res.redirect('/login')
        }
    } catch (error) {
        res.redirect('/register')
    }
})

app.delete('/logout', function (req, res, next) {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}
function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

app.listen(PORT, function () {
    console.log("server started on port " + PORT)
});