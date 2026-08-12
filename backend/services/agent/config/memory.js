import redis from "../../../shared/redis/redis.js"
import { getMesgForMem } from "../utils/getMesgForMem.js"

export const getMemory=async (conversationId) => {
    //redis key
    const key=`messages-${conversationId}`
    const cached=await redis.get(key)

    //for ongoing conv
    if(cached) {
        return JSON.parse(cached)
    }

    //for a new conv
    const messages=await getMesgForMem(conversationId)
    await redis.set(key,JSON.stringify(messages),"EX",24*60*60)

    return messages
}

export const addMessageInMemory=async (conversationId,role,content) => {
    const key=`messages-${conversationId}`
    const rawMessages=await redis.get(key)

    const messages=rawMessages ? JSON.parse(rawMessages) : []

    //add new message to the array
    messages.push({
        role,
        content
    })

    if(messages.length > 20) {
        //remove first message
        messages.shift()
    }

    redis.set(key,JSON.stringify(messages))
}