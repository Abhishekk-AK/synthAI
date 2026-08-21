import { Code2, FileText, Globe, ImageIcon, MessagesSquare, Mic, Paperclip, Presentation, Send, Zap } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import sendMessage from '../features/sendMessage'
import { createConversation } from '../features/createConversation'
import { addConversation, setConversationTitle, setSelectedConversation } from '../redux/conversationSlice'
import { addMessage, setArtifacts } from '../redux/messageSlice'
import { updateConversation } from '../features/updateConversation'
import { useRef } from 'react'

function ChatInput() {
  const [value,setValue]=useState("")
  const [selectedAgent,setSelectedAgent]=useState("Auto")
  const [selectedFile,setselectedFile]=useState(null)
  const {selectedConversation}=useSelector(state=>state.conversation)
  const dispatch=useDispatch()
  const fileRef=useRef(null)

  // const handleCreateConversation=async () => {
  //   const data=await createConversation()
  //   dispatch(addConversation(data))
  //   dispatch(setSelectedConversation(data))
  //   return data
  // }

  const handleSendMessage=async () => {
    let conversation=selectedConversation
    if(!conversation) {
      const data=await createConversation()
      dispatch(setSelectedConversation(data))
      dispatch(addConversation(data))
      conversation=data
    }

    // const conv=handleCreateConversation()
    // const convId=selectedConversation ? selectedConversation?._id : conv._id

    if(conversation?.title=="New Chat") {
      await updateConversation({id:conversation?._id,title:value})

      dispatch(setConversationTitle({conversationId:conversation?._id,title:value.trim()}))
    }

    // const payload={
    //   prompt:value.trim(),
    //   conversationId:conversation?._id,
    //   agent:selectedAgent.toLowerCase()
    // }
    // console.log(payload)

    const formdata=new FormData()
    formdata.append("prompt",value.trim())
    formdata.append("conversationId",conversation?._id)
    formdata.append("agent",selectedAgent.toLowerCase())
    formdata.append("file",selectedFile)

    dispatch(addMessage({role:"user",content:value.trim()}))
    setValue("")
    const data=await sendMessage(formdata)
    dispatch(setArtifacts(data?.artifacts || []))
    dispatch(addMessage({role:"assistant",content:data?.answer,images:data?.images}))
    console.log(data)
  }


  const agents=[
    {
      id:"auto",
      icon:Zap,
      label:"Auto",
    },
    {
      id:"chat",
      icon:MessagesSquare,
      label:"Chat",
    },
    {
      id:"coding",
      icon:Code2,
      label:"Coding",
    },
    {
      id:"vision",
      icon:ImageIcon,
      label:"Vision",
    },
    {
      id:"pdf",
      icon:FileText,
      label:"PDF",
    },
    {
      id:"ppt",
      icon:Presentation,
      label:"PPT",
    },
    {
      id:"search",
      icon:Globe,
      label:"Search",
    },
  ]


  return (
    <>
      <div className='w-full overflow-hidden md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]'>
        <div className='flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>
          
          <div className='flex w-[80%] gap-2 pr-2 flex-wrap'>
            {agents.map((agent)=>{
              const isActive=selectedAgent===agent.label
              const Icon=agent.icon
              
              return (
                <>
              {/* <button 
                onClick={()=>setSelectedAgent(agent.id)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg border-none transition-colors duration-150 cursor-pointer
                  ${selectedAgent===agent.id 
                  ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white" 
                  : "bg-white/[0.05] text-slate-600 hover:text-slate-400"}`}
              >
                <agent.icon size={16} />
              </button> */}

              
              <div
                onClick={()=>setSelectedAgent(agent.label)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer
                  ${isActive 
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,0.35)]" 
                  : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"}`}
              >
                <Icon size={14}
                  className={`${isActive ? "text-white" : "text-slate-500"}`}
                />
                {agent.label}
              </div>
              </>
              )
            })}
          </div>

          <textarea
            placeholder='Ask Anything...'
            rows={3}
            onChange={(e)=>setValue(e.target.value)}
            value={value}
            className='w-full bg-transparent outline-none resize-none text-slate-200 placeholder:text-slate-600 
              text-[14px] leading-relaxed [scrollbar-width:none] [&::-webkit-scroll]:hidden disabled:opacity-50'
          />
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>

              <input 
                type='file' 
                accept='.pdf,image/*' 
                hidden ref={fileRef} 
                onChange={(e)=>{
                  const file=e.target.files[0]
                  if(file) {
                    setselectedFile(file)
                  }
                }}
              />

              <button
                onClick={()=>fileRef.current.click()}
                className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 
                hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'
              >
                <Paperclip size={16} />
              </button>
              <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 
              hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'>
                <Mic size={16} />
              </button>
            </div>
            <div className='flex items-center justify-center'>
              <button 
                disabled={!value}
                onClick={handleSendMessage}
                className={`flex items-center justify-center w-8 h-8 rounded-lg border-none transition-colors duration-150 cursor-pointer
                  ${value.trim() ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white" 
                  : "bg-white/[0.05] text-slate-600 cursor-not-allowed"}`}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatInput