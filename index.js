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
    if (!serverPlayerStats[users[i]]) continue;  // Add this check
    let playerBullets = serverPlayerStats[users[i]]["bullets"]
    
    // Filter out bullets that are out of bounds (help of AI)
    serverPlayerStats[users[i]]["bullets"] = playerBullets.filter(bullet => {
      return bullet["x"] >= 0 && bullet["x"] <= 200 && 
             bullet["y"] >= 0 && bullet["y"] <= 400
    })
  }
}

function checkCollisions() {
  let users = Object.keys(serverPlayerStats)

  for (var i = 0; i < users.length; i++) {
    let shooter = users[i]
    if (!serverPlayerStats[shooter]) continue
    
    let playerBullets = serverPlayerStats[shooter].bullets

    for (var z = 0; z < playerBullets.length; z++) {
      let bullet = playerBullets[z]
      let currentUsers = Object.keys(serverPlayerStats)
      
      for (var j = 0; j < currentUsers.length; j++) {
        let target = currentUsers[j]
        if (shooter === target) continue
        
        if (!serverPlayerStats[target]) continue
        
        let playerX = serverPlayerStats[target].x
        let playerY = serverPlayerStats[target].y
        
        if (playerX == null || playerY == null) continue
        
        if (bullet.x >= playerX - 20 && bullet.x <= playerX + 20 &&
            bullet.y >= playerY - 20 && bullet.y <= playerY + 20) {
          decreasePlayerHealth(target)
          playerBullets.splice(z, 1)
          z--
          break
        }
      }
    }
  }
}

// Increase interval from 1ms to 30ms
setInterval(function (){
  const healthArray = Object.values(serverPlayerStats).map(player => player.health);
  console.log("Player health:", healthArray);
  updatePlayerPositions()
  updateAllBullets()
  checkCollisions()
}, 30)  // Changed from 1 to 30

function decreasePlayerHealth(user) {
  serverPlayerStats[user]["health"] -= 10
  if (serverPlayerStats[user]["health"] <= 0) {
    // to lazy to "optimize" this
    delete serverPlayerStats[user]
    io.sockets.emit("update", serverPlayerStats);
    // io.sockets.emit("playerDied", user)
    return;
  }
}

// Increase interval from 1ms to 30ms
setInterval(function (){
  const healthArray = Object.values(serverPlayerStats).map(player => player.health);
  console.log("Player health:", healthArray);
  updatePlayerPositions()
  updateAllBullets()
  checkCollisions()
}, 30)  // Changed from 1 to 30

io.on('connection', (socket) => {
  socket.on('addPlayer', (obj) => {
    let userList = Object.keys(serverPlayerStats)
    let user = obj["user"]
    if (userList.includes(user)) {
      return false
    }
    serverPlayerStats[user] = {
      x: Math.floor(Math.random() * 50) + 25,
      y: Math.floor(Math.random() * 50) + 25,
      holdingWeapon: false,
      mouseX: null,
      mouseY: null,
      bullets: [],
      health: 100
    }
  });

  socket.on('updatePlayer', (obj) => {
    let user = obj["user"];
    if (!serverPlayerStats[user]) return;
    // Only update position, mouse, bullets, etc. but NOT health from client
    serverPlayerStats[user].x = obj["player"].x;
    serverPlayerStats[user].y = obj["player"].y;
    serverPlayerStats[user].mouseX = obj["player"].mouseX;
    serverPlayerStats[user].mouseY = obj["player"].mouseY;
    serverPlayerStats[user].bullets = obj["player"].bullets;
});

  socket.on('removePlayer', (obj) => {
    // console.log(obj["user"])
    delete serverPlayerStats[obj["user"]]
    // console.log(serverPlayerStats)
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