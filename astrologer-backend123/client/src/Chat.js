import React,{useState,useEffect} from 'react'
import "./App.css"

function Chat({socket,userName,roomId}) {
    const [currentMessage,setCurrentMessage] = useState("")
    // const [database,setDatabase] = useState([])
    

    async function sendMessage(){
        const messageData = {
            message:currentMessage,
            userName:userName,
            roomId:roomId,
            time: new Date(Date.now()).getHours() +":"+  new Date(Date.now()).getMinutes()
        }
        if(currentMessage!==""){
          await  socket.emit("send_message",messageData)

        }
     }

     useEffect(()=>{
        socket.on("receive_message",(data)=>{
            const m = document.createElement("p")
            m.innerText = data.message
            document.getElementsByClassName("chat-body")[0].appendChild(m)
            
            console.log(data)
        })
     },[socket])

  return (
    <div className='chat-window'>
      <div  className='chat-header'><p>username {userName} chat box</p></div>
      <div  className='chat-body'></div>
      <div className="chat-footer">
        <input type="text" name="" id="" placeholder='enter message' onChange={(e)=>{setCurrentMessage(e.target.value)}}/>
        <button onClick={()=>{sendMessage()}}>send</button>
      </div>
    </div>
  )
}

export default Chat