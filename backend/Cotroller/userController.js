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
        throw new Error('Please add al fields')
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

    if(user && (await bcrypt.compare(password, user.password))) {
       const Token = generateToken(user._id)
        await User.updateOne( {email}, { $set: { User_token: Token } } )
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            Token: Token
        })
        // setTimeout(async ()=>{
        //  await User.updateOne( {email}, { $set: { User_token: null } } )
        //  console.log(user)
        // }, 600000)
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
    const { _id, name, email} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email
    })
})

const generateToken = ( id ) => {
    const userToken = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '15m',
    })
    return userToken;
}

const logoutUser = asyncHandler ( async (req, res) => { 
    const { email } = req.body
    const user = await User.findOne({email})

    if(!email) {
        res.status(400)
        throw new Error('Please check your email')
    } 

    const tokenToBeBlacklist = user.User_token
    const blacklistedToken = new BlacklistedToken({token: tokenToBeBlacklist})
    blacklistedToken.save()
    res.status(200).json("User Logged out successfully!")
    // if(user.User_token === null) {
    //     res.status(400)
    //     throw new Error('User already logged out')
    // }
    // else {
    //     await User.updateOne( {email}, { $set: { User_token: null } } )
    //     res.status(200).json("User Logged out successfully!")
    // }
    
})
 

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    // getAllUsers
}