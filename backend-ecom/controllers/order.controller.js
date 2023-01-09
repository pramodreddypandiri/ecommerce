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

    //verify product price from backend

    // make a DB query to get all products and info

    //total amount and final amount
    // coupon check in DB
    // final amount = totalAmount - discount
    const options = {
        amount: Math.round(totalAmount *100),
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`
    }
    const order =  await razorpay.orders.create(options)
    //if order does not exist (failure), throw error
    
    // success => send to front end
})