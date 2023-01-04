import User from '../models/user.schema';
import asyncHandler from '../services/asyncHandler'
 import CustomError from '../utils/customError'
import { cookieOptions } from '../utils/cookieOptions';
import mailHelper from '../utils/mailHepler';
import crypto from 'crypto'


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


/********* 
* @SIGNIN
* @route http://localhost:6000/api/auth/signin
* @discription User signin controller for logging user
@parameters name,email, password
@returns User Object

**************/

export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        throw new CustomError("Please fill all fields")
    }
    const user = await User.findOne({email}).select("+password")

    if(!user) {
        throw new CustomError('Invalid Credentials', 400)
    }
    const passwordMatch = await user.comparePassword(password)

    if(passwordMatch){
        const token = user.getJwtToken()
        user.password = undefined
        res.cookie("token",token, cookieOptions)
        res.status(200).json({
            success: true,
            token,
            user
        })
    }

})

/********* 
* @LOGOUT
* @route http://localhost:6000/api/auth/login
* @discription User logout  controller for logging out user by clearing user cookies
@parameters 
@returns  success message

**************/

export const logout = asyncHandler(async(req, res) => {
    // res.clearCookie()
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true

    })
    res.status(200).json({
        success: true,
        message: "Logget Out"

    })
})

/********* 
* @FORGOT_PASSWORD
* @route http://localhost:6000/api/auth/password/forgot
* @discription User will submit a email , we will generate a token
@parameters email
@returns  success message - email send

**************/

export const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body

    if(!email){
        throw new CustomError('Enter Email')
    }
    const user = await User.findOne({email})

    if(!user){
        throw new CustomError("User does not exist", 400)
    }
    const resetToken = user.generateForgotPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`
     const text = `Your password reset link is ${resetUrl}\n\n`
    try{
        await mailHelper({
            email: user.email ,
            subject:"Password Reset",
            text: text
        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}`
        })
    }catch(error){
        //roll back changes - clear fields and save
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        throw new CustomError(error.message || "Failed to send email",500)

    }


})

/********* 
* @RESET_PASSWORD
* @route http://localhost:6000/api/auth/password/:resetPasswordToken
* @discription User will be able to reset password
@parameters token from url, password, and confirm password
@returns  user object

**************/

export const resetPassword = asyncHandler(async (req, res) => {
    const {token: resetToken} = req.params
    
    const {password, confirmPassword} = req.body
    
    const reserPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // find one based on token and token expiry fields
    const user = await User.findOne({
        forgotPasswordToken: reserPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    })
    if(!user){
        throw new CustomError('Password token is invalid or expired ', 400)
    }
    if(password !== confirmPassword) {
        throw new CustomError("Password and confirm password does not match")
    }
    // save password to DB
    user.password = password;
    // make forgotPasswordToken & Expiry undefined again
    user.forgotPasswordExpiry = undefined,
    user.forgotPasswordToken = undefined,
    // save user in DB
    await user.save()

    // create token and send to user
    const token = user.getJwtToken()

    res.cookie("token",token, cookieOptions)
    res.status(200).json({
        success: true,
        user,

    })

    


})