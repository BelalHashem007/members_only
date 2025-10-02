const express = require("express");
const path = require("node:path");
const app = express();
const indexRouter = require("./routes/indexRouter");
const session = require("express-session");
const passport = require("passport");

//app setups
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
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
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
  });
PORT = 3000;

//routes
app.use("/", indexRouter);

//server listen
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("Server is listening on PORT: ", PORT);
});
