import { config } from "dotenv";
import dotenv from dotenv;

dotenv.config()

const consfig = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || "30d"
}


export default config