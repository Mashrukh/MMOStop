var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"), //allows for method overriding on the ejs templates. Eg using pot, and delete instead of post in forms
    Game  = require("./models/game"),
    Comment     = require("./models/comment"),
    User        = require("./models/user")

    
// requring routes
var commentRoutes    = require("./routes/comments"),
    gamesRoutes      = require("./routes/games"),
    indexRoutes      = require("./routes/index")


var url = process.env.DATABASEURL   || "mongodb://localhost/mmo_portal"  //backup incase the url is lost
mongoose.connect(url);

// setup the necessary dependencies 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
app.use(flash());
//seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret message!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// gives access to the current user id to every single route
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/games", gamesRoutes);
app.use("/games/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The MMOPortal Server Has Started!");
});