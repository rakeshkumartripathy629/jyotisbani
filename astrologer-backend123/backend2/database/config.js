const mysql = require("mysql")
require("dotenv").config()
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DATABASE
})

// conn.connect((error)=>{
//   if(error){
//    console.error("Error while connecting to mySql !!");
//   }else{
//    console.log("connected to mysql..");
//   }
// })
// module.exports = conn;
conn.connect(function(err){
  if(err){
      console.error('error connection:'+err.stack);
      return;
  }
  console.log('connecting as id'+ conn.threadId);
});



module.exports=conn;