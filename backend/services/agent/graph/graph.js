import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { routerAgent } from "./router";
import { chatAgent } from "../agents/chat.agent";
import { codingAgent } from "../agents/coding.agent";
import { pdfAgent } from "../agents/pdf.agent";
import { pptAgent } from "../agents/ppt.agent";
import { searchAgent } from "../agents/search.agent";
import { vision, visionAgent } from "../agents/vision.agent.js";

const workFlow=new StateGraph(agentState)

//nodes with their work in agents mode
workFlow.addNode("router",routerAgent)
workFlow.addNode("chat",chatAgent)
workFlow.addNode("coding",codingAgent)
workFlow.addNode("pdf",pdfAgent)
workFlow.addNode("ppt",pptAgent)
workFlow.addNode("search",searchAgent)
workFlow.addNode("vision",visionAgent)

//connect nodes with edges
workFlow.addEdge("__start__","router")
workFlow.addConditionalEdges("router",(state)=> {
    switch (state.agent) {
        case "chat":
            //if agent is chat return chat node
            return "chat";
        case "coding":
            return "coding";
        case "pdf":
            return "pdf";
        case "ppt":
            return "ppt";
        case "search":
            return "search";
        case "vision":
            return "vision";

        default:
            return "chat";
    }
}, {
    //pathmap (map the nodes to be returned as output of switchcase)
    chat:"chat",
    coding:"coding",
    pdf:"pdf",
    ppt:"ppt",
    search:"search",
    vision:"vision",
})

//connect end edges
workFlow.addEdge("search","chat")
workFlow.addEdge("chat","__end__")
workFlow.addEdge("coding","__end__")
workFlow.addEdge("pdf","__end__")
workFlow.addEdge("ppt","__end__")
workFlow.addEdge("vision","__end__")

export const graph=workFlow.compile()