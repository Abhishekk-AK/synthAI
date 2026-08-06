import { Annotation } from "@langchain/langgraph";

//custom state
export const agentState=Annotation.Root({
    prompt:Annotation(),
    aiResponse:Annotation(),
    agent:Annotation(),
})