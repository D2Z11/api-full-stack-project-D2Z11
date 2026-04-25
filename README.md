# API-Project
## HTML/CSS Static Structure ✱
> See first commit (Initial commit)
Adds index.html, index.js, style.css to the public folder. This public folder is "static" and sent to client via the server.
## Async JS & API Calls ✱
In order for the server and the client to communicate we need to use WebSockets. This allows us to send data back and forth without refreshing the page. We use the socket.io library to handle this communication. The server listens for events from the client, and the client listens for events from the server. This allows us to keep track of player positions, bullets, etc. in real-time. (I would consider websockets and the server as the API calls)

In terms of asynchronous JavaScript, we use setInterval to update the game state every 30ms. This allows us to update the client and server at similar time intervals, while also allowing for the game to run smoothly without blocking the main thread. Although setInterval doesn't have the "async" keyword, it is asychronous by definition.
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