const express = require('express');
const session = require('express-session')
const dotenv = require('dotenv').config();
const colors = require('colors')
const connectDB = require('./config/db')
const {errorHandler} = require('./middleware/ErrorMiddleware')

const port = process.env.PORT || 3000;

connectDB()

const app = express();

app.use(session({
    secret : process.env.JWT_SECRET,
    resave : false,
    saveUninitialized : true,
    // cookie : { maxAge : 120000 } // set the session duration
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use('/api/goals', require('./Routes/goalRoutes'))
app.use('/api/users', require('./Routes/userRoutes'))
app.use(errorHandler)

app.listen(port, ()=> {
    console.log(`server started on port ${port}`);
})
