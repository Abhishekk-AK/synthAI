import { getModel } from "../config/llmModels.js"

export const codingAgent=async (state) => {
    const intentLlm=await getModel("intent")
    const llm=await getModel("coding")

    //intent classification to determine the type of coding request
    const intentRes=await intentLlm.invoke(
        `You are an intent classifier.
        
        Return onlyone of these values:
        CODE_GENERATION
        CODE_REVIEW
        CODE_EXPLANATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION

        User Request: ${state?.prompt}
        `
    )

    const intent=intentRes.content
    
    //if intent is code generation
    if(intent==="CODE_GENERATION") {
        const prompt=`
            You are SynthAI Coding Agent.
            
            Generate the requested project.

            Default stack:
            -HTML
            -CSS
            -JavaScript

            Use React.js / Next.js / Vue.js or other frameworks only if user explicitly requests it.

            Rules:
            -Resonsive
            -Modern UI
            -CSS Variables
            -Flexbox / Grid
            -Smooth Scroll
            -Hover Effects
            -Beautiful Spacing
            -Beautiful UI
            -Single Page unless user asks otherwise.

            Return ONLY valid JSON.
            Schema:
            {
                "files":[
                    {   
                        "name":"index.html",
                        "content":"..."
                    },
                    {    
                        "name":"style.css",
                        "content":"..."
                    },
                    {
                        "name":"script.js",
                        "content":"..."
                    }
                ]
            }
            
            Rules:
            -Output must start with {
            -Output must end with }
            -No Markdown
            -No Explanation
            -No Extra Text
            -No \`\`\`
            -Never mention intent

            User Request: ${state.prompt}

        `
        const res=await llm.invoke(prompt)
        //console.log(JSON.parse(res.content))

        let data
        try {
            data=JSON.parse(res.content)
        } catch (error) {
            console.log("JSON parse error", error)
        }

        //returning code as artifacts
        return {
            ...state,
            aiResponse:"Code generated Successfully",
            artifacts:[
                {
                    id:Date.now(),
                    type:"Project",
                    title:state?.prompt,
                    files:data?.files || [],
                }
            ]
        }
    }

    //if intent is not code generation
    const res=await llm.invoke(
        `The user request is: 
        
        ${intent}

        Return Markdown only.
        
        Never generate project files.

        Use Headings like:
        # Overview
        ## Explanation
        ## Problems
        ## Improvements
        ## Best Practices
        ## Optimized Code(if needed)

        user request: ${state?.prompt}
        `
    )

    const data=res?.content

    return {
        ...state,
        aiResponse:data,
        artifacts:[]
    }
}