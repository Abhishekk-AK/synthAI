import { Check, Copy, ExternalLink, X } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MessageBubble({role,content,images}) {
  const isUser=role==="user"
  const [lightBox,setLightBox]=useState(null)
  const [copiedCode,setCopiedCode]=useState("")

  const copyCode=async (code) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode("")
    }, 2000);
  }

  return (
    <>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2.5 rounded-2xl break-words overflow-hidden leading-relaxed 
          ${isUser 
          ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm "
          : "text-slate-200 rounded-tl-sm"}
          `}>
          {
            images.length>0 && (
              <div className='flex flex-wrap gap-3 mt-4'>
                {
                  images.map((img,i)=>(
                    <img
                      key={i}
                      src={img}
                      loading='lazy'
                      onClick={()=>setLightBox(img)}
                      onError={(e)=>e.currentTarget.remove()}
                      className='w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-70 transition'
                    />
                  ))
                }
              </div>
            )
          }
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={ {
              h1:({children})=>(
                <h1 className='text-2xl font-bold mt-5 mb-3'>{children}</h1>
              ),
              h2:({children})=>(
                <h2 className='text-xl font-semibold mt-4 mb-2'>{children}</h2>
              ),
              h3:({children})=>(
                <h3 className='text-lg font-semibold mt-3 mb-2'>{children}</h3>
              ),
              p:({children})=>(
                <p className='break-words whitespace-pre-wrap mb-3'>{children}</p>
              ),
              ul:({children})=>(
                <ul className='list-disc pl-5 space-y-1 my-2'>{children}</ul>
              ),
              ol:({children})=>(
                <ol className='list-decimal pl-5 space-y-1 my-2'>{children}</ol>
              ),
              table:({children})=>(
                <div className='my-4 overflow-x-auto'>
                  <table className='min-w-full border border-white/10'>{children}</table>
                </div>
              ),
              th:({children})=>(
                <th className='px-3 py-2 text-left bg-white/10 border border-white/10'>{children}</th>
              ),
              td:({children})=>(
                <td className='px-3 py-2 border border-white/10'>{children}</td>
              ),
              a:({href,children})=>(
                <a 
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                  className='text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-1'>
                    {children}
                    <ExternalLink size={14} />
                </a>
              ),
              code:({className,children})=>{
                const value=String(children).trim()
                const language=className?.replace("language-","")

                if(!className) {
                  return (
                    <code className='px-1.5 py-0.5 rounded bg-white/10 text-indigo-300'>
                      {value}
                    </code>
                  )
                }

                return (
                  <div className='my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]'>
                    <div className='flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2'>
                      <span className='uppercase text-xs text-slate-400'>
                        {language}
                      </span>
                      <button 
                        onClick={()=>copyCode(value)}
                        className='flex items-center gap-1 text-xs'
                      >
                        {
                          copiedCode==value
                          ? <>
                              <Check size={14} />
                              Copied
                          </>
                          : <>
                              <Copy size={14} />
                              Copy
                          </>
                        }
                      </button>
                    </div>

                    <SyntaxHighlighter
                      language={language}
                      style={oneDark}
                      wrapLongLines={true}
                      showLineNumbers={true}
                      customStyle={{
                        margin:0,
                        padding:"16px",
                        backgroundColor:"#0d1117",
                        fontSize:"13px",
                      }}
                    >
                      {value}
                    </SyntaxHighlighter>
                  </div>
                )
              },
              img:({src})=>{
                if(!src) return null
                return (
                  <img
                    src={src}
                    loading='lazy'
                    onClick={()=>setLightBox(src)}
                    onError={(e)=>e.currentTarget.remove()}
                    className='w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-70 transition'
                  />
                )
              }
            }}
          >
            {content}
          </Markdown>
        </div>
        {
          lightBox && 
          <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6'>
            <button
              onClick={()=>setLightBox(null)}
              className='absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2'
            >
              <X />
              <img
                src={lightBox}
                className='max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain'
              />
            </button>
          </div>
        }
      </div>
    </>
  )
}

export default MessageBubble