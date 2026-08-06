import axios from "axios"
import { graph } from "../graph/graph.js"

export const agent=async (req, res) => {
    try {
        //saving user message in db
        const {prompt, conversationId}=req.body
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

        //response sent to frontend
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({message:`agent error ${error}`})   
    }
}