const query = require("../db/query");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//local-strategy
const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await query.getUser(username);
    if (!user) return done(null, false, { message: "Incorrect username." });
    const match = bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: "Incorrect password." });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await query.getUserById(id);
    done(null, user);
  } catch (error) {
    done(err);
  }
});
//----------------
//validation
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 20 characters.";
const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Last name ${lengthErr}`),
  body("username")
    .trim()
    .isEmail()
    .withMessage(`Username must be a valid email!`)
    .custom(async (value) => {
      const user = await query.getUser(value);
      if (user) {
        throw new Error("E-mail already in use");
      }
    }),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      `Password must be 8 or more characters with at least 1 lowercase, 1 uppercase, 1 number, 1 symbol.`
    ),
  body("passwordConfirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password confirmation is not the same as Password."),
];
const validateMessage = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 80 })
    .withMessage("Title must be between 5 and 80 characters"),
  body("content")
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage("Message content must be between 50 and 5000 characters"),
];
//----------------
async function getSignup(req, res) {
  res.render("sign-up", { title: "Sign-up" });
}

const postSignup = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.send({ errors: errors.array() });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { ...req.body };
    user.password = hashedPassword;
    await query.createUser(user);
    res.redirect("/log-in");
  },
];

async function getHome(req, res) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    const messages = await query.getAllMessages();
    return res.render("index", { isAuth: true ,messages});
  }
  return res.render("index", { isAuth: false });
}

async function getLogin(req, res) {
  res.render("log-in");
}

const postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

async function getLogout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function getSecret(req, res) {
  res.render("secretForm");
}

async function postSecret(req, res) {
  if (req.body.secretPass == "Belal123") {
    await query.updateMembership(1, req.user.id);
    console.log(req.user);
    res.redirect("/");
  } else res.send(`Wrong password! <a href="/">Home</a>`);
}

async function getMessageForm(req, res) {
  if (req.isAuthenticated()) {
    res.render("messageForm");
  } else
    res.send(`You must be logged in to post a message. <a href="/">Home</a>`);
}

const postMessage = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.send({ errors: errors.array() });
    }
    const message = req.body;
    message.userid = req.user.id;
    const now = new Date();
    const shortFormatter = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });
    message.date= shortFormatter.format(now);
    console.log(message)
    await query.createMessage(message);
    res.redirect('/');
  },
];
module.exports = {
  getSignup,
  postSignup,
  getHome,
  getLogin,
  postLogin,
  getLogout,
  getSecret,
  postSecret,
  getMessageForm,
  postMessage,
};
