const express= require("express");
const WebSocket = require("ws");
const app = express()
const server = require("http").createServer(app);
app.use(express.json())
const {default:mongoose} =require("mongoose")
const cors = require("cors");
const bet = require("./controllers/bet");
const wss = new WebSocket.Server({server:server});

app.use(cors());
mongoose.connect("mongodb+srv://123:1234@cluster0.pf4v08v.mongodb.net/matka-01",{useNewUrlParser:true})
.then(()=>{console.log("mongodb is connected")})
.catch((err)=>{console.log(err)});


app.use("/user",require("./routes/user"))
app.use("/api",require("./routes/bet"))
app.use("/games",require("./routes/results"))



wss.on("connection", (ws) => {

  console.log("WebSocket connection established");
  ws.send("welcome new client")
  ws.on("message", (data) => { 

    let wsData =JSON.parse(data);
        console.log(comingData);

if(wsData.endPoint == "placeBet"){
bet.wssBet(wsData.req,ws);
}
if(wsData.endPoint == "results"){
bet.wsResults(wsData.req,ws);
}
if(wsData.endPoint == "userResult"){
  bet.wsResultPerUser(wsData.req,ws);
}
});
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

server.listen(3000, () =>
{
  console.log("Listening at 3000");
});