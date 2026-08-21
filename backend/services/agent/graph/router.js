import { getModel } from "../config/llmModels.js"
import { agent } from "../controllers/agent.controller.js"

export const routerAgent=async (state) => {

    if(state.agent && state.agent!=="auto") {
        return {
            ...state,
            agent:state.agent
        }
    }

    if(state.file.mimetype==="application/pdf") {
        return {
            ...state,
            agent:"pdfRag"
        }
    }

    if(state.file.mimetype.startsWith("image/")) {
        return {
            ...state,
            agent:"imageAnalyzer"
        }
    }

    const llm=await getModel("routerAgent")

    const prompt=`

        You are an agent router. Your sole job is to analyze the user's input and route it to the single best agent available.

        Available agents:
        - chat
        - coding
        - pdf
        - ppt
        - search
        - vision

        Rules for classification:

        chat:
        General conversation, small talk, explanations, educational concepts, creative writing, brainstorming, non-technical advice, historical facts, philosophy, or text summarization that does not require real-time data, image processing, or specialized file exporting.

        coding:
        Writing code, debugging errors, explaining software architecture, code optimization, database queries, API integration, refactoring, script automation, or answering technical questions about programming languages and frameworks.

        pdf:
        Handling all PDF workflows. This includes analyzing/summarizing uploaded PDF documents, as well as requests to create, convert, download, compile, or export text, resumes, reports, or the ongoing conversation into a downloadable PDF file.

        ppt:
        Creating presentation outlines, generating slide content, formatting bullet points for decks, organizing speech notes for slides, or designing structure for pitch decks and keynotes.

        search:
        Queries requiring real-time information, current events, live stock data, sports scores, weather updates, checking facts, finding local businesses, or looking up recent news that happened after the LLM's cutoff date.

        vision:
        Handling all image-related tasks. This includes multi-modal image analysis (describing photos, reading text via OCR, interpreting charts) AND image generation (creating art, rendering graphics, drawing illustrations, or generating images from text descriptions).

        Return ONLY one word from this list:
        chat
        coding
        pdf
        ppt
        search
        vision

        Examples:

        Input: "Can you write a python script to scrape a website?"
        Output: coding

        Input: "Who won the football game last night?"
        Output: search

        Input: "Generate a photorealistic image of a futuristic cyberpunk city at night"
        Output: vision

        Input: "Explain quantum physics like I am 5 years old"
        Output: chat

        Input: "What does the attached quarterly report PDF say about revenue?"
        Output: pdf

        Input: "Convert our entire chat conversation today into a PDF document for me"
        Output: pdf

        Input: "Can you look at this screenshot and tell me why my CSS layout is broken?"
        Output: vision

        Input: "I need a 10 slide outline for a venture capital pitch deck"
        Output: ppt

        Input: "Draw a cute cartoon cat wearing a tiny wizard hat"
        Output: vision

        Input: "Compile a detailed research report on renewable energy and give it to me as a PDF"
        Output: pdf

        Input: "How do I fix a NullPointerException in Java?"
        Output: coding

        User Query:
        ${state.prompt}

    `

    const response=await llm.invoke(prompt)
    console.log(response)

    return {
        ...state,
        agent:response.content.trim().toLowerCase()
    }
}