import "dotenv/config";
import express from "express";
const app = express();
import mongoose from "mongoose";
import morgan from "morgan";
import session from "express-session";
import authController from "./controllers/auth.js";
import methodOverride from "method-override";
import { isSignedIn }  from "./middleware/is-signed-in.js";
import {passUserToView}  from "./middleware/pass-user-to-view.js";
import applicationsController from "./controllers/applications.js";

const port = process.env.PORT ? process.env.PORT : '3000';
import path from "path";
const __dirname = path.resolve();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);

app.get('/', (req, res) => {
  if (req.session.user){
    res.redirect(`/users/${req.session.user._id }/applications`)
  } else {
    res.render('index.ejs', {
      user: req.session.user,
    });
  }
});

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/applications', applicationsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
