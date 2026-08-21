import fs from "fs"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { vectorStore } from "../config/vectorDb.js"
import { getModel } from "../config/llmModels.js"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { deductCredits } from "../utils/deductCredits.js"

export const pdfRag=async (state) => {
    try {
        const buffer=fs.readFileSync(state.file.path)

        const pdf=new PDFParse({
            data:buffer,
        })

        //get all text of pdf
        const result=await pdf.getText()

        const text=result.text

        //get small chunks of text
        const splitter=new RecursiveCharacterTextSplitter({
            chunkSize:1000,
            chunkOverlap:300,
        })

        //small documents of chunks
        const docs=await splitter.createDocuments([text])
        const collectionName=`pdf-${Date.now()}`

        //store chunks after embedding in vectorDB
        const store=await vectorStore(docs,collectionName)

        const relevantDocs=await store.similaritySearch(state.prompt,5)

        const context=relevantDocs.map(d=>d.pageContent).join("\n\n")

        const llm=await getModel("pdf-rag")

        const messages=[
            new SystemMessage(
                `You are a SynthAI PDF Assistant.

                Rules:

                - Answer only from the uploaded PDF.
                - Never Make up information.
                - If the answer is not in PDF, reply:
                    "I couldn't find this information in the uploaded PDF."
                - Use Markdown formatting.
                `
            ),
            new HumanMessage(
                `Context: ${context}
                Question: ${state.prompt}
                `
            ),
        ]

        const response=await llm.invoke(messages)

        await deductCredits(state.userId,"pdf")

        return {
            ...state,
            aiResponse:response.content
        }

    } catch (error) {
        console.error(error)
        return {
            ...state,
            aiResponse:`Failed to analyze PDF right now.`
        }

    } finally {
        fs.unlinkSync(state.file.path)
    }
}