const mysql = require("mysql")
require("dotenv").config()
const conn = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DATABASE
})

conn.connect(function(err){
  if(err){
      console.error('error connection:'+err.stack);
      return;
  }
  console.log('connecting as id'+ conn.threadId);
});


// conn.connect((error)=>{
//   if(error){
//    console.error("Error while connecting to mySql !!");
//   }else{
//    console.log("connected to mysql..");
//   }
// })


//.......................for session managment.........................//

// const session  = require("express-session")
// const mySqlStore = require("express-mysql-session")(session)

// const sessionStore = new mySqlStore({
//     expiration :10800000,
//     createDatabaseTable:true,
//     schema:{
//         tableName:"sessionTable",
//         columnName:{
//             session_id:"session_id",
//             expires:"expires",
//             data:"data"
//         }
//     }
//   },db)

module.exports = conn;