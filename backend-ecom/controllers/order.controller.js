import Products from '../models/product.schema'
import razorpay from '../config/razorpay.config'
import Coupon from '../models/coupon.schema'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError'
import Order from '../models/order.schema'


//Generate razorpay id
/*


*/
export const generateRazorpayOrderId = asyncHandler(async(req, res) => {
    // get product and coupon  from frontend
    const {products, coupon } = req.body

    //verify product price from backend
    

    // make a DB query to get all products and info
    
    // coupon check in DB
    
    let totalAmount;
    const couponInDB = await Coupon.findOne(coupon)
    if (!couponInDB || !couponInDB.active){
        throw new CustomError("Invalid Coupon", 401)
        
    }

    const discount = couponInDB.discount
    //total amount and final amount
    
    // final amount = totalAmount - discount
    const finalAmount = totalAmount - (discount*(totalAmount))/100
    
    const options = {
        amount: Math.round(finalAmount *100),
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`
    }
    const order =  await razorpay.orders.create(options)
    //if order does not exist (failure), throw error
    if(!order){
        throw new CustomError("Failed to create order", 401)
    }
    res.status(200).json({
        success: true,
        order
    })
    // success => send to front end
})