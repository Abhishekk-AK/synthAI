// import dotenv from "dotenv"
// dotenv.config()

import "dotenv/config"
import express from "express"
import connectDb from "./config/db.js"
import router from "./routes/agent.route.js"

const port=process.env.PORT

const app=express()
app.use(express.json())
app.use("/",router)

//send global error from whole agent service app to fe
//error handling middleware
app.use((err,req,res,next)=>{
    console.log(err)

    //error set by dev(i.e. agentLimit error)
    if(err.status) {
        return res.status(err.status).json(err.data)
    }

    //controller error
    return res.status(500).json({message:`agent error ${err}`})
})

app.get("/", (req, res)=> {
    res.json({message:'hello from agent'})
})

app.listen(port, ()=>{
    console.log(`agent started at ${port}`)
    connectDb()
})