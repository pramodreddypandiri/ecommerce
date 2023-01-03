import mongoose, { trusted } from "mongoose";

const collectionSchema = new mongoose.Schema (
    {
       name: {
            type: String,
            required: [true, "Please provide a catediry name"],
            trim: true,
            maxLength: [120, "Collection name should be under 120 chars"]
       } 
    },
    {
        timestamps: true

    }

) 
export default mongoose.model("Collection",collectionSchema)
