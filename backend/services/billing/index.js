import "dotenv/config"
import express from "express"
import connectDb from "./config/db.js"

const port=process.env.PORT

const app=express()
app.use(express.json())

app.get("/", (req, res)=> {
    res.json({message:'hello from billing'})
})

app.listen(port, ()=>{
    console.log(`billing started at ${port}`)
    connectDb()
})