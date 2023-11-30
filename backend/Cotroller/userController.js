const jwt = require('jsonwebtoken')
const bcrypt = require ('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const BlacklistedToken = require('../models/BlacklistedTokens')

// const getAllUsers = asyncHandler (async (req, res) => {
//     console.log(User.name)
//     res.status(200).json(User.find())
// })

// @desc Register new user
// @route POST /api/users
// @access public
const registerUser = asyncHandler (async (req, res) => {
    const {name, email, password} = req.body
    
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // check if the user already exists
    const userExist = await User.findOne({email})
    if(userExist) {
        res.status(400)
        throw new Error('User already exists')
    }

    // hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create a user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201)
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            Token: generateToken(user._id)
        })
    } 
    else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc Authenticate user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler (async (req, res) => {
    const {email, password} = req.body

    // check for user
    const user = await User.findOne({email})
    console.log("req.session", req.session.user)
    if(user && (await bcrypt.compare(password, user.password))) {
        req.session.user = user
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
        })
        console.log("Login successful")        
    }
    else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})

// @desc Get user data
// @route GET /api/users/me
// @access public
const getMe = asyncHandler (async (req, res) => {
    const {email} = req.body
    
    if(req.session.user.email === email){
        res.status(200).json({
            id: req.session.user._id,
            name : req.session.user.name,
            email
        })
    }
    else {
        res.status(400).json({
            message : "Please enter correct id."
        })
        
    }
})

const logoutUser = asyncHandler ( async (req, res) => { 
    const { email } = req.body

    if(!email) {
        res.status(400)
        throw new Error('Please check your email')
    }

    if(req.session.user.email === email){
        req.session.destroy(err => {
            if(err){
                console.error(err)
            }
            else {
                res.send("Logout Successful.")
            }
        })
    }
    else {
        res.status(400)
        throw new Error('Please check your email')
    }    
})
 

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    // getAllUsers
}