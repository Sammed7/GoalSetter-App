const express = require('express')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const BlacklistedTokens = require('../models/BlacklistedTokens');

class customeError1 extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

const protect = asyncHandler (async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]

            // check for blacklisted tokens
            const isBlacklisted = await BlacklistedTokens.findOne({token})
            if(isBlacklisted) {
                throw new customeError1('User already logged out or Token expired', 401)
            }
            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get User from token
            req.user = await User.findById(decoded.id).select("-password")

            // if(req.user.User_token === null) {
            //     throw new customeError1('User already logged out or Token expired', 401)
            // }

            next()
        } 
        catch (error) {
            if(error instanceof customeError1){
                res.status(error.statusCode).json({error: error.message})
            } 
            else{
                res.status(401)
                throw new Error('Not authorized!')
            }
        }
    }

    if(!token) {
        res.status(401)
        throw new Error('Not authorized! No token')
    }
})

module.exports = {protect}