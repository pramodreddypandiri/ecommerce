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
})