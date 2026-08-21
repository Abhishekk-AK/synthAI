import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { routerAgent } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { visionAgent } from "../agents/vision.agent.js";
import { pdfRag } from "../agents/pdfRag.agent.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.agent.js";

const workFlow=new StateGraph(agentState)

//nodes with their work in agents mode
workFlow.addNode("router",routerAgent)
workFlow.addNode("chat",chatAgent)
workFlow.addNode("coding",codingAgent)
workFlow.addNode("pdf",pdfAgent)
workFlow.addNode("ppt",pptAgent)
workFlow.addNode("search",searchAgent)
workFlow.addNode("vision",visionAgent)
workFlow.addNode("pdfRag",pdfRag)
workFlow.addNode("imageAnalyzer",imageAnalyzer)

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
        case "pdfRag":
            return "pdfRag";
        case "imageAnalyzer":
            return "imageAnalyzer";

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
    pdfRag:"pdfRag",
    imageAnalyzer:"imageAnalyzer",
})

//connect end edges
workFlow.addEdge("search","chat")
workFlow.addEdge("chat","__end__")
workFlow.addEdge("coding","__end__")
workFlow.addEdge("pdf","__end__")
workFlow.addEdge("ppt","__end__")
workFlow.addEdge("vision","__end__")
workFlow.addEdge("pdfRag","__end__")
workFlow.addEdge("imageAnalyzer","__end__")

export const graph=workFlow.compile()