import User from '../models/user.schema';
import asyncHandler from '../services/asyncHandler'
 import CustomError from '../utils/customError'
import { cookieOptions } from '../utils/cookieOptions';

/********* 
* @SIGNUP
* @route http://localhost:6000/api/auth/signup
* @discription User signup controller for creating a new user
@parameters name,email, password
@returns User Object

**************/

export const signUp = asyncHandler(async (req, res,) => {
    const {name, email, password} = req.body
    //check for all required data
    if(!name || !email || !password){
        throw new CustomError('Please fill all fields')
    }
    //check if user exists 
    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new CustomError('User already exists')
    }
    // else create a user
    const user = await User.create({
        name, email, password
    })
    // create a token
    const token = await user.getJwtToken()
    console.log(user);
    user.password = undefined

    res.cookie("token",token, cookieOptions )
    res.status(200).json({
        success: true,
        token,
        user
    })

})