import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import couponSchema from "../models/coupon.schema";


// create a coupon 
export const createCoupon = asyncHandler(async (req, res) =>{
    const {code} = req.body
    if(!code){
        throw new CustomError("Coupon code is required", 400)
    }
    const couponCode = await couponSchema.create({code})
    if(!couponCode){
        throw new CustomError("Unable to create a coupon", 401)
    }
    res.status(200).json({
        success: true,
        message: "Create coupon successfully",
        couponCode
    })

})


// deactivate coupon
export const deactivateCoupon = asyncHandler(async(req, res) => {
    const {id: couponId} = req.params

    const isDeactivated = await couponSchema.findByIdAndUpdate(couponId,{active:false})
    if(!isDeactivated){
        throw new CustomError("Unable to deactivate", 401)
    }
    res.status(200).json({
        success: true,
        message: "Deactivate coupon successfully"
    })

    
})

//delete coupon
export const deleteCoupon = asyncHandler(async (req,res) => {
    const{id: couponId} = req.params
    const isDeleted = await couponSchema.findByIdAndDelete(couponId)
    if(!isDeleted){
        throw new CustomError("Coupon not found", 404)
    }
    res.status(200).json({
        success: true,
        message: "Deleted coupon Successfully"
    })
})


// get all coupons
export const getAllCoupons = asyncHandler(async (req, res) =>{
    const coupons = await couponSchema.find()
    if(!coupons){
        throw new CustomError("Coupons not found", 404)
    }
    res.status(200).json({
        success: true,
        message: "Fetched all coupons",
        coupons
    })
})