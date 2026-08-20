import { Annotation } from "@langchain/langgraph";

//custom state
export const agentState=Annotation.Root({
    //state keys
    prompt:Annotation(),
    aiResponse:Annotation(),
    agent:Annotation(),
    conversationId:Annotation(),
    searchResults:Annotation(),
    images:Annotation(),
    artifacts:Annotation(),
    userId:Annotation(),
})