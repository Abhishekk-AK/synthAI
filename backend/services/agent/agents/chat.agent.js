import { getModel } from "../config/llmModels.js"

export const chatAgent=async (params) => {
    const llm=await getModel("chat")
    const systemPrompt="You are SynthAI, an intelligent AI assistant."
    const response=await llm.invoke([
        {
            "role":"system",
            "content":systemPrompt
        },
        {
            "role":"human",
            "content":state.prompt
        }
    ])

    return {
        ...state,
        aiResponse:response.content
    }
}