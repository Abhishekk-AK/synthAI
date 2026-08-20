import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"
import { generatePdf } from "../utils/generatePdf.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"

export const pdfAgent=async (state) => {
    try {
        const llm=await getModel("pdf")
        const prompt=`
        You are an expert document writer.

        Return Only valid JSON.

        Do not return markdown.

        Do not return explanations.

        Structure:
        {
            "title":"",
            "subtitle":"",
            "sections":[
                {
                    "heading":"",
                    "points":[]
                }
            ]
        }
        
        Generate 4-8 sections.

        Each section should have 3-6 concise bullet points.

        Topic:

        ${state.prompt}

        `

        const res=await llm.invoke(prompt)
        //console.log(JSON.parse(res.content))

        const data=JSON.parse(res.content)

        //decduct credits after getting pdf data in backend
        //await deductCredits(state.userId,"pdf")

        const pdfBuffer=await generatePdf(data)

        const filename=`pdf-${Date.now()}.pdf`
        await uploadToS3(filename,pdfBuffer,"application/pdf")

        const downloadUrl=await getFromS3(filename,24*60)

        //deduct credits after download link
        await deductCredits(state.userId,"pdf")

        return {
            ...state,
            aiResponse:`
            PDF Generated

            **${data.title}**

            📋[Download PDF](${downloadUrl})

            ⌛ Link expires in 10 minutes.
            `
        }

    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse:`
            Failed to generate PDF.
            `
        }
    }
}