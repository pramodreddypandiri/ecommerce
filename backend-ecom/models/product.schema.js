import mongoose from "mongoose";    

const prodctSchema  = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a product name"],
            trim: true,
            maxLenght: [120, "Product name should be under 120 chars"]
        },
        price: {
            type: Number,
            required: [true, "Please provide a product price"],
            maxLenght: [6, "Product price should be less than 6 digits"],

        },
        description: {
            type: String,
            // use some form of editor - assignmenet
        },
        photos: [
            {
                secure_url: {
                    type: String,
                    required: true,
                }
            }
        ],
        stock: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection"
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Product", prodctSchema)