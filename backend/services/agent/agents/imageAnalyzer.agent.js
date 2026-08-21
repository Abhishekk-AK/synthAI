import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import fs from "fs/promises"
import { deductCredits } from "../utils/deductCredits.js"

export const imageAnalyzer=async (state) => {
    try {
        const llm=await getModel("imageAnalyzer")
        
        //base 64 image
        const imageBuffer=await fs.readFile(state.file.path)
        const base64Image=imageBuffer.toString("base64")

        //array sent to llm
        const messages=[
            new SystemMessage(
                `You are SynthAI Image Analyzer Agent.
                
                Rules:
                - Analyze only the upload image.
                - Answer the user's questions accurately.
                - If text exists in image, extract it.
                - If charts and tables exist, explain them.
                - If something is unclear, say so.
                - Use markdown when useful.
                - Do no hallucinate.
                `
            ),
            new HumanMessage(
                {
                    content:[
                        {
                            type:"text",
                            text:state.prompt || "Analyze the image.",
                        },
                        {
                            type:"image_url",
                            "image_url":{
                                url:`data:${state.file.mimetype};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ),
        ]

        const response=await llm.invoke(messages)

        await deductCredits(state.userId,"vision")

        return {
            ...state,
            aiResponse:response.content
        }

    } catch (error) {
        console.error("Image analyzer error", error)
        return {
            ...state,
            aiResponse:"Unable to analyze the image right now. Please try again."
        } 

    } finally {
        await fs.unlink(state.file.path)
    }
}