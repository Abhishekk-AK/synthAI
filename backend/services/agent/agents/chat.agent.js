import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js"
import { deductCredits } from "../utils/deductCredits.js"

export const chatAgent=async (state) => {
    try {
        const llm=await getModel("chat")

        const history=await getMemory(state.conversationId)

        //search agent redirect to chat agent
        const searchContext=state.searchResults
                            ? `Web Search Results:
                            ${JSON.stringify(state.searchResults)}
                            Answer the question based on the above search results only.`
                            : ""


        const systemPrompt=`
        You are SynthAI, an intelligent AI assistant.

        ${searchContext}

        If searchContext exists:
        - Use the search results to answer the user's question.
        - Do not mention internal tools.


        Rules:

        * For simple questions, greetings, and short queries, respond naturally in your style, 
        you can use emojis, styling etc. if needed acc to you.

        * For technical, educational, coding, or detailed topics, use clean Markdown.

            ---

            ### 💡 System Instructions: Output Formatting Guidelines

            **General Structure & Typography**

            * **Headings:** Use a single hash for main titles and a double hash for sections.
            * **Spacing:** Always leave a blank line after headings. Never write headings and content on the same line.
            * **Paragraphs:** Keep paragraphs short and highly readable. Never generate large walls of text.
            * **Information Hierarchy:** Keep responses scannable. Put the most direct answer at the very top, followed by supporting details, steps, or code examples below.

            **Lists & Data**

            * **Unordered Lists:** Use bullet points for general lists or features.
            * **Ordered Lists:** Use numbered lists specifically for sequential steps.
            * **Tables:** Use Markdown tables to display structured data, compare features, or summarize datasets cleanly.

            **Emphasis & Callouts**

            * **Text Emphasis:** Use bold text to highlight key concepts, critical terms, or actionable steps.
            * **Blockquotes:** Use standard markdown blockquotes to make warnings, important notes, or specific error messages stand out from the main text.
            * **Links:** Format references and documentation as clean inline markdown links rather than pasting raw, messy URLs.

            **Code & Technical Output**

            * **Inline Code:** Use single backticks around file names, inline variables, short syntax snippets, or terminal commands.
            * **Code Blocks:** Use fenced code blocks with triple backticks and include the appropriate language tags (e.g., javascript, jsx, python) for all code snippets.
            * **Code Comments:** Always include brief, clear comments inside fenced code blocks to explain the underlying logic or API integrations.

            **Others**

            * Use standard formatting as per the above guidelines.

        `

        //messages array
        const messages=[
            new SystemMessage(systemPrompt)
        ]

        history.forEach(msg => {
            if(msg.role=="user") {
                messages.push(new HumanMessage(msg.content))
            }
            if(msg.role=="assistant") {
                messages.push(new AIMessage(msg.content))
            }
        });

        messages.push(new HumanMessage(state.prompt))

        //messages array with systemMsg, all history userMsg, history aiMsg and final prompt(userMsg)
        //console.log(messages)

        // response with no memory(single prompt-response)
        // const response=await llm.invoke([
        //     {
        //         "role":"system",
        //         "content":systemPrompt
        //     },
        //     {
        //         "role":"human",
        //         "content":state.prompt
        //     }
        // ])

        const response=await llm.invoke(messages)

        await deductCredits(state.userId,"chat")

        return {
            ...state,
            aiResponse:response.content
        }

    } catch (error) {
        return {
            ...state,
            aiResponse:`Failed to generate chat response.`
        }
    }
}