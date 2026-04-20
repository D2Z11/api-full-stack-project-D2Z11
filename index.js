// some imports
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

// uses static site from /public
app.use(express.static("public"));

let serverPlayerStats = {
  
};

// client-side
function updatePlayerPositions(){
  io.sockets.emit("update", serverPlayerStats);
}

function updateAllBullets() {
  let users = Object.keys(serverPlayerStats)
  
  for (var i = 0; i < users.length; i++) {
    let playerBullets = serverPlayerStats[users[i]]["bullets"]
    
    // Filter out bullets that are out of bounds (help of AI)
    serverPlayerStats[users[i]]["bullets"] = playerBullets.filter(bullet => {
      return bullet["x"] >= 0 && bullet["x"] <= 200 && 
             bullet["y"] >= 0 && bullet["y"] <= 400
    })
  }
}

setInterval(function (){
  // console.log(serverPlayerStats)
  updatePlayerPositions()
  updateAllBullets()
}, 1)

io.on('connection', (socket) => {
  socket.on('addPlayer', (obj) => {
    let userList = Object.keys(serverPlayerStats)
    let user = obj["user"]
    if (userList.includes(user)) {
      return false
    }
    serverPlayerStats[user] = {x: null, y: null, holdingWeapon: false, mouseX: null, mouseY: null, bullets: []}
  });

  socket.on('updatePlayer', (obj) => {
    serverPlayerStats[obj["user"]] = obj["player"]
  })

  socket.on('removePlayer', (obj) => {
    console.log(obj["user"])
    delete serverPlayerStats[obj["user"]]
    console.log(serverPlayerStats)
  })
});

// io.on("connect", function(socket) {
//   updateAllBullets()
//   updatePlayerPositions()
// })

server.listen(port, function() {
  console.clear()
  console.log("🟢 localhost:" + port);
});