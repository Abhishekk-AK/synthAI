import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"
import { generatePpt } from "../utils/generatePpt.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"

export const pptAgent=async (state) => {
    try {
        const llm=await getModel("ppt")

        const prompt=`
        You are a profesional presentation designer.

        Return Only valid JSON.

        Format:
        {
            "title":"",
            "subtitle":"",
            "slides":[
                {
                    "title":"",
                    "points":[
                        "",
                        "",
                        "",
                        ""
                    ]
                }
            ]
        }
        
        Rules:

        - Generate exactly 6 content slides.
        - Each slide should have 4-6 concise bullet points.
        - No markdown.
        - No explanation.
        - No code block.
        - Return ONLY JSON.

        Topic:
        ${state.prompt}

        `
        const res=await llm.invoke(prompt)
        console.log(JSON.parse(res.content))

        let jsonCleaned=res.content.replace(/```json/g, "").replace(/```/g, "").trim()

        const data=JSON.parse(jsonCleaned)
        const ppt=await generatePpt(data)
        const buffer=await ppt.write({
            outputType:"nodebuffer"
        })

        const filename=`ppt-${Date.now()}.pptx`

        await uploadToS3(filename,buffer,"application/vnd.openxmlformats-officedocument.presentationml.presentation")
        const downloadUrl=await getFromS3(filename,24*60*60)

        await deductCredits(state.userId,"ppt")

        return {
            ...state,
            aiResponse:`
            Presentation Generated

            **${data.title}**

            📋[Download PPT](${downloadUrl})

            ⌛ Link expires in 10 minutes.
            `
        }

    } catch (error) {
        console.log(error)

        return {
            ...state,
            aiResponse:`
            Failed to generate PPT.
            `
        }
    }
}