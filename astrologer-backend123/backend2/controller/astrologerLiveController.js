const conn = require("../database/config");
const { io } = require("../utils");

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    // console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  socket.on("send_message", (data) => {
    console.log("data  :  "+data.message)
    const sql = "insert into live_chat (room_id,message,user_name) values(?,?,?)"
    conn.query(sql,[data.roomId,data.message,data.userName],(error)=>{
      if(error) {
        console.error(error)
        res.status(500).json({error:"failed to send message"})
      }
    })
    socket.to(data.roomId).emit("receive_message", data);
    // console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

module.exports = {
  astrologerLiveCall: (req, res) => {
    res.send("socket")
  },
};