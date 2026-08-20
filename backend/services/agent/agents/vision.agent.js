import { getModel } from "../config/llmModels.js"
import axios from "axios"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { deductCredits } from "../utils/deductCredits.js"

export const visionAgent=async (state) => {
    try {
        const llm=await getModel("image")
        const res=await llm.invoke(
            `You are an elite AI Image prompt engineer.

            convert the user request into a highly detailed image generation prompt.

            Requirements:

            - Cinematic Lighting
            - Professional Composition
            - Ultra Realistic
            - High Detail
            - Beautiful Color Pallete
            - Sharp Focus
            - 8K Quality
            - Photorealistic
            - Depth Of Field
            - Professional Photography
            - Stunning Visuals

            Return Only the image prompt.

            User Request:
            ${state.prompt}

            `
        )

        const prompt=res.content.trim()

        const imageUrl=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

        const imageRes=await axios.get(imageUrl,{responseType:"arraybuffer"})
        console.log(imageRes)

        const buffer=Buffer.from(imageRes?.data)
        const filename=`image-${Date.now()}.png`

        await uploadToS3(filename,buffer,"image/png")

        const downloadUrl=await getFromS3(filename,24*60)

        await deductCredits(state.userId,"vision")

        return {
            ...state,
            aiResponse:`
            ![Generated Image](${downloadUrl})

            🖼️ [Download Image](${downloadUrl})

            ⌛ Link expires in 10 minutes.
            `
        }

    } catch (error) {
        return {
            ...state,
            aiResponse:`
            Failed to generate image.
            `
        }
    }
}