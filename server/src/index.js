import dotenv from "dotenv" ; 
import express from "express"
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path : "./.env"
})

console.log(`port ${process.env.PORT}` )

connectDB()
.then( () => {
    app.listen( process.env.PORT || 8000 , () => {
        // app
        console.log(` server is running on : ${process.env.PORT}`) ; 
    }  )
}
).catch( (err) => {
    console.log(`mongoDB database is not connected : ` , err ) ; 
} ) ; 
