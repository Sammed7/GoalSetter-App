const express = require('express');
const session = require('express-session')
const dotenv = require('dotenv').config();
const colors = require('colors')
const connectDB = require('./config/db')
const {errorHandler} = require('./middleware/ErrorMiddleware')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const port = process.env.PORT || 3000;

connectDB()

const app = express();

app.use(session({
    secret : process.env.JWT_SECRET,
    resave : false,
    saveUninitialized : true,
    // cookie : { maxAge : 120000 } // set the session duration
}))

app.use(passport.initialize());
app.use(passport.session());

const userSessions = {};

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = user.find((u) => u.id === id);
    done(null, user);
});

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use('/api/goals', require('./Routes/goalRoutes'))
app.use('/api/users', require('./Routes/userRoutes'))
app.use(errorHandler)

app.listen(port, ()=> {
    console.log(`server started on port ${port}`);
})
