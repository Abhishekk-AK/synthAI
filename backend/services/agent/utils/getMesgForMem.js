import axios from "axios"

//call get message to store in all messages of a conv to work like a memory to llm
export const getMesgForMem=async (conversationId) => {
    try {
        const {data}=await axios.get(`${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}