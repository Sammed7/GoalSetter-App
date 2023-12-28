const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors')
const connectDB = require('./config/db')
const {errorHandler} = require('./middleware/ErrorMiddleware')

const port = process.env.PORT || 6000;

connectDB()

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use('/api/goals', require('./Routes/goalRoutes'))
app.use('/api/users', require('./Routes/userRoutes'))
app.use(errorHandler)

app.listen(port, ()=> {
    console.log(`server started on port ${port}`);
})
