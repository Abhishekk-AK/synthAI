import React, { useEffect } from 'react'
import Navbar from './Navbar'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../redux/messageSlice'
import getMessages from '../features/getMessages'

function ChatArea() {
  const {selectedConversation}=useSelector(state=>state.conversation)
  const dispatch=useDispatch()

  useEffect(()=>{
    const getMsg=async () => {
      if(selectedConversation) {
        //clear old messages to prevent display prev conversation's m
        dispatch(setMessages([]))
        
        if(selectedConversation.title=="New Chat") {
          return
        }
        const data=await getMessages(selectedConversation?._id)
        dispatch(setMessages(data))
      }
    }
    getMsg()
  },[selectedConversation?._id])

  return (
    <>
      <div className='flex-1 flex flex-col'>
        <Navbar />
        <MessageList />
        <ChatInput />
      </div>
    </>
  )
}

export default ChatArea