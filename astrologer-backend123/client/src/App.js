
import React,{useState} from 'react'
import io from "socket.io-client"
import Chat from './Chat'
import axios from "axios"
import "./App.css"

const socket = io.connect("http://localhost:3001/")



function App() {
    const [userName,setUserName] = useState("")
    const [roomId,setRoomId] = useState("")
    const [isJoined,setIsJoined] = useState(false)

    async function joinRoom(){
        
        if(userName!=="" && roomId!==""){
            socket.emit("join_room",roomId)
            setIsJoined(true)
        }else{
            console.log("enter room and name")
        }
    }
  return (
    <div>
      
      {!isJoined && (<div className='joinChatContainer'>
      <h4>best live stream </h4>
      <input type="text" name="" id="username" placeholder='your user name' onChange={(e)=>{setUserName(e.target.value)}} />
      <input type="text" name="" id="" placeholder='room id' onChange={(e)=>{setRoomId(e.target.value)}}/>
      <button onClick={()=>{joinRoom()}}>join room</button>
      </div>)}

      {isJoined &&(<Chat socket = {socket} userName = { userName} roomId = {roomId}/>)}
    </div>
  )
}

export default App

