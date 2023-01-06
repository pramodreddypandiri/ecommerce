import User from '../models/user.schema'
import JWT from 'jsonwebtoken'
import asyncHandler from '../services/asyncHandler';
import CustomError from '../utils/customError';
import config from '../config/index';
//middle ware
export const isLoggedIn = asyncHandler(async (req, res, next) => {
    let token;
    // get token from cookies or headers
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.satrtWith("Bearer")) ) {
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }
    if(!token){
        throw new CustomError("Not authorized to access this route",401)
    }
    try {
        const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET)
        // find user and get required values
        req.user = await User.findById(decodedJwtPayload._id, "name email role")
        next()
    } catch (error) {
        throw new CustomError("Not Authorized to access this route", 401)
        
    }
})