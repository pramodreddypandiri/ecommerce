import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError';
import Collection from '../models/collection.schema'

/********* 
* @Create_Collection
* @route http://localhost:6000/api/collection
* @discription controllection for creating and saving a collection
@parameters collection name
@returns  collection object

**************/


export const createCollection = asyncHandler(async (req, res) => {
    // take name and check for null value
    const {name} = req.body
    if(!name){
        throw new CustomError("Collection name is needed", 401)
    }
    //add this name to DB
    const collection = await Collection.create({name})
    // send res to Front End (FE)
    res.status(200).json({
        success: true,
        message: "Collection created successfully ",
        collection

    })

})

//Update Collection
export const updateCollection = asyncHandler(async (req, res) => {
    //get existing value from FE
    const {id: collectionId} = req.params
    // get new value from FE
    const {name} = req.body

    if(!name){
        throw new CustomError("Collection name is needed", 401)
    }
    
    let updatedCollection = await Collection.findByIdAndUpdate(collectionId, {name,}, {
        //use this if you need DB to retrun updated collection
        new: true,
        runValidators: true
    })
    if(!updateCollection){
        throw new CustomError("Collection not found", 400)

    }

    // send res to FE
    res.status(200).json({
        success: true,
        message: "Collection updated Successfully",
        updateCollection
    })
})

//Delete collection
export const deleteCollection = asyncHandler(async (req, res) => {
    //get id of cllection from FE
    const {id: collectionId} = req.params
    // delete in DB
    const collectionToDelete = await Collection.findByIdAndDelete(collectionId)
    if(!collectionToDelete){
        throw new CustomError("Collection not found",401)
    }
    // Free up space
    collectionToDelete.remove()
    res.status(200).json({
        success: true,
        message: "Collection deleted successfully"
    })

})

// get all collection 
export const getAllCollection = asyncHandler(async(req, res) => {
    const colllections = await Collection.find()
    if(!colllections) {
        throw new CustomError("No collection found", 400)
    }
    res.status(200).json({
        success: true,
        message: "Fetched all collections" ,
        colllections

    })
})