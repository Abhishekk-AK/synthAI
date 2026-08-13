import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const createConversation=async (req, res) => {
    try {
        const userId=req.headers["x-user-id"]
        console.log("userId", userId)

        const conversation=await Conversation.create({
            userId:userId,
        })

        return res.status(200).json(conversation)

    } catch (error) {
        return res.status(500).json({message:`conversation create error ${error}`})
    }
}

//get all conversations of user
export const getConversations=async (req, res) => {
    try {
        const userId=req.headers["x-user-id"]
        console.log("userId", userId)

        const conversations=await Conversation.find({
            userId:userId,
        }).sort({updatedAt:-1})

        return res.status(200).json(conversations)

    } catch (error) {
        return res.status(500).json({message:`get all conversations error ${error}`})
    }
}

//update conv title
export const updateConversation=async (req, res) => {
    try {
        const {id, title}=req.body
        console.log("userId", userId)

        const conversation=await Conversation.findByIdAndUpdate(id, {
            title
        })

        return res.status(200).json(conversation)

    } catch (error) {
        return res.status(500).json({message:`update conversation error ${error}`})
    }
}

//saveMessage --> create and save a new message
export const saveMessage=async (req, res) => {
    try {
        const {conversationId, role, content, images}=req.body
        const message=await Message.create({
            conversationId,
            content,
            role,
            images,
        })

        return res.status(200).json(message)

    } catch (error) {
        return res.status(500).json({message:`save message error ${error}`})   
    }
}

//get all messages of a particular conversation
export const getMessages=async (req, res) => {
    try {
        const conversationId=req.params.conversationId
        const messages=await Message.find({
            conversationId:conversationId
        })

        return res.status(200).json(messages)

    } catch (error) {
        return res.status(500).json({message:`get all messages error ${error}`})   
    }
}