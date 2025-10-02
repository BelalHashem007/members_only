//imports
const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const session = require("express-session");
const passport = require("passport");

//app setups
const app = express();
PORT = 3000;
app.set("views", path.join(__dirname, "views"));//setting the views file and the engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));//allows us to read body from forms
const assetsPath = path.join(__dirname,"public");
app.use(express.static(assetsPath))
//auth
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//allowing access for user info in the ejs templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
  });

//routes
app.use("/", indexRouter);

//handling errors
app.use((req,res)=>{
  res.status(404).send("Page not found.")
});
app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).send(err);
});

//server listen
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("Server is listening on PORT: ", PORT);
});
