import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs/dist/bcrypt";
import { JWT } from "jsonwebtoken";
import crypto from "crypto";
import  config from "../config/index";
// create a user schema 
const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength:[50,"Name must be less than 50 chars"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength:[8,"Password must be more than 8 chars"],
        select: false
    },
    role:{
        type: String,
        enum: Object.values(AuthRoles),
        default: AuthRoles.USER
    },
    forgotPasswordTokens: String,
    forgotPasswordExpiry: Date,

},
{
    timestamps: true
}
) 
// task one -  encrypt password
// pre is mongoose hook == middle ware
userSchema.pre('save', async function(next){
    //set encrypted pw with bcrypt
    // if pwd already existed
    if(!this.isModified("password")) {
        return next()
    } 
    // when giving pwd for first time
    this.password = await bcrypt(this.password, 10)
    next()
})
// add functions/methods or features to mongoose schema
userSchema.methods = {
    //compare password
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
    },
    //generate JWT TOKEN
    getJwtToken: function(){
        return JWT.sign(
            {
                _id: this._id,
                role: this.role
            },
            config.JWT_SECRET,
            {
                expiresIn: config.JWT_EXPIRY
            }
        )
    },
    generateForgtPasswordToken: function () {
        this.forgotToken = crypto.randomBytes(20).toString('hex')

        //step 1 = encrypt and store forgotToken to DB
        this.forgotPasswordTokens = crypto.createHash('sha256').update(forgotToken).digest("hex")
        // set time limit for setting password again
         this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000 

        // step  = 2 send to user
         return forgotToken
    }
}

export default mongoose.model("User", userSchema)
