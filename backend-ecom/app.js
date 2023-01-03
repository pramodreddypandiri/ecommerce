import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import morgan from 'morgan';


const app = express()
// middle ware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())
app.use(morgan('tiny'))


export default app;