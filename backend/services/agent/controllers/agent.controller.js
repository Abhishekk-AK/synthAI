import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessageInMemory } from "../config/memory.js"

export const agent=async (req, res) => {
    try {
        const {prompt, conversationId}=req.body

        //add mesg in redis for memory
        await addMessageInMemory(conversationId,"user",prompt)

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
        })

        //returned state by graph
        const response=result.aiResponse

        await addMessageInMemory(conversationId,"assistant",response)
        
        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
            conversationId,
            role:"assistant",
            content:response
        })

        //response sent to frontend
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({message:`agent error ${error}`})   
    }
}