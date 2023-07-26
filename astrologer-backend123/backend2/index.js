const express = require("express");
const astrologerRouter = require("./routes/astrologerRoutes");
const liveRouter = require("./routes/socketRouter")
require("dotenv").config();
const {app,server} = require("./utils")

const PORT = process.env.PORT || 3001;
// const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", astrologerRouter);
app.use("/", liveRouter);


app.get("/", (req, res) => {
  res.send("Home");
});

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
