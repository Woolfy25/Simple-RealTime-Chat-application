const express = require("express");

const app = express();

const http = require("http");

const server = http.createServer(app);

const io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));

const users = {};

io.sockets.on("connection", (client) => {
  const transmitere = (event, data) => {
    client.emit(event, data);
    client.broadcast.emit(event, data);
  };

  transmitere("user", users);

  client.on("message", (message) => {
    if (users[client.id] !== message.name) {
      users[client.id] = message.name;

      transmitere("user", users);
    }
    transmitere("message", message);
  });

  client.on("disconnect", () => {
    delete users[client.id];
    client.broadcast.emit("user", users);
  });
});

server.listen(3000, () => {
  console.log("Serverul ruleaza pe portul 3000");
});
