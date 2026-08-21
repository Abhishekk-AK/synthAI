import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessageInMemory } from "../config/memory.js"
import redis from "../../../shared/redis/redis.js"

export const agent=async (req, res) => {
    try {
        const {prompt, conversationId, agent}=req.body
        const userId=req.headers["x-user-id"]
        const file=req.file

        //saving user message in db
        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
            conversationId,
            role:"user",
            content:prompt
        })

        //start a graph and give state to graph
        const result=await graph.invoke({
            prompt,
            conversationId,
            agent,
            userId,
            file,
        })

        //returned state by graph
        const response=result.aiResponse

        //add mesg in redis for memory
        await addMessageInMemory(conversationId,"user",prompt)

        await addMessageInMemory(conversationId,"assistant",response)

        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
            conversationId,
            role:"assistant",
            content:response,
            images:result?.images,
            artifacts:result?.artifacts,
        })

        //response sent to frontend
        return res.status(200).json({
            answer:result?.aiResponse,
            images:result?.images,
            artifacts:result?.artifacts,
        })

    } catch (error) {
        return res.status(500).json({message:`agent error ${error}`}) 
        console.log(error)  
    }
}