const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routes/userRoute")

app.use("/",userRouter)
app.get("/", (req, res) => {
  res.send("home");
});

app.listen(PORT, () => {
  console.log(`server running at port : ${PORT}`);
});
