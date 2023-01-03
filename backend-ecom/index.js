import mongoose from "mongoose";
import app from './app'
import  config  from "./config/index";

// use a iife for cnnecting DB
(async () => {
    try {
        await mongoose.connect(config.MONGOD_URL)
        console.log("DB CONNECTED");

        app.on('error',(err) => {
            console.log("ERROR", err);
            throw err;
        })

        const onListening = () => {
            console.log(`Listening on ${config.PORT}`);
        }
        
        app.listen(config.PORT, onListening)
    } catch (err) {
        console.log("ERROR", err);
        throw err
    }
})()
