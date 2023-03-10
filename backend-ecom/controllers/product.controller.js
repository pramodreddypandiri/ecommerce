import Product from '../models/product.schema'
import formidable from 'formidable'
import fs from 'fs'
import {s3FileDelete, s3FileUpload} from '../services/imageUpload';
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError'
import { Mongoose } from 'mongoose';

import s3 from '../config/s3.config';
import config from '../config/index';

export const addProduct = asyncHandler (async(req, res) =>{
    const form = formidable({
        multiples: true,
        keepExtensions: true,

    })
    form.parse(req, async function (err, fields, files) {
        try{
            if(err){
                throw new CustomError("Something went wrong" , 401)
            }
            //creating a custom id 
            let productId =  new Mongoose.Types.ObjectId().toHexString()
            //console.log(fields, files);
            //check for fields
            if(!fields.name || !fields.price || !fields.descrption || !fields.collectionId){
                throw new CustomError("Please fill all fields")
            }
            // handling images (Prmise.all to confirm all images are uploaded)
            let imgArrayResp = Promise.all(
                Object.keys(files).map(async(filekey,index) => {
                    const element = files[filekey]

                    const data  =   fs.readFileSync(element.filepath)

                    const upload = await s3FileUpload({ bucketName: config.S3_BUCKET_NAME,
                        Key: `products/${productId}/photo_${index + 1}.png`,
                        Body: data,
                        ContentType: element.mimetype

                    })
                    return {
                        secure_url: upload.Location
                    }
                })
            )
             let imgArray = await imgArrayResp;
            const product = await Product.create({
                _id: productId,
                photos: imgArray,
                ...fields,

            })
            if(!product){
                throw new CustomError("Product was not created", 400)
                // remove images from AWS S3
            }
            res.status(200).json({
                success: true,
                product
            })

        } catch(error){
            return res.status(500).json({
                success: false,
                message: error.message || "Something went wrong"
            })
            
        }
    })
})

// get all products 
export const getAllProducts = asyncHandler(async(req, res) => {
    const products = await Product.find()
    if(!products){
        throw new CustomError("No product was found",404)

    }
    res.status(200).json({
        success: true,
        products
    })

})

// get product by id
export const getProductById = asyncHandler(async(req, res) => {
    const {id: productId} = req.params
    const product = await Product.findById(productId)
    if(!product){
        throw new CustomError("No product was found",404)

    }
    res.status(200).json({
        success: true,
        product
    })

})

// delete product 
export const deleteProduct = asyncHandler(async (req, res) => {
    const {id: productId} = req.params
    const deleted = await Product.findByIdAndDelete(productId)
    if(!deleted){
        throw new CustomError("Could not able to delete", 401)
    } 
    res.status(200).json({
        success: true,
        message: "Deleted product successfully"
    })

})
// assignment to read : 
/*
model.aggregate([{}, {}, {}])
$group
$push
$lookup
$project
*/