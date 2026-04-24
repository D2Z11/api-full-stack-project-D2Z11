# API-Project
## HTML/CSS Static Structure ✱
> See first commit (Initial commit)
Adds index.html, index.js, style.css to the public folder. This public folder is "static" and sent to client via the server.
## Async JS & API Calls ✱
In order for the server and the 
## Database Integration/  localStaorage ✱
> See second commit (First commit of the project, this is a culmination of previous efforts and is a working basic p5.js shooter game)
It creates a Express.js server, then uses the below object to keep track of player positions, bullets, etc. This is shared with the client, which sends back only the player it's modifying (see second code snippet)
```
let serverPlayerStats = {
  
};
```
```
Server:
socket.on('updatePlayer', (obj) => {
    serverPlayerStats[obj["user"]] = obj["player"]
})
Client:
socket.on("update", function(playerServerSideObj) {
  playersOnServerSide = playerServerSideObj
})
```
## UI/UX & Design ✱
