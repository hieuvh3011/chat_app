const express = require("express");
const dotenv = require("dotenv");
const AuthRoute = require("./src/routing/AuthRoute");
const ConversationRoute = require("./src/routing/ConversationRoute");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const UserRoute = require("./src/routing/UserRoute");

/**
 * end import here
 * Use mixed import in this file
 * */

const app = express();
const server = require("http").createServer(app);
const io = socket(server);

dotenv.config();

app.use(bodyParser.json({ type: "application/*+json" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});

io.on("connection", (socket) => {
  const chatID = socket.handshake.query.chatID;
  socket.join(chatID);
  //Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(chatID);
  });
  //Send message to only a particular user
  socket.on("send_message", (message) => {
    const receiverChatID = message.receiverChatID;
    const senderChatID = message.senderChatID;
    const content = message.content;
    //Send message to only that particular room
    socket.in(receiverChatID).emit("receive_message", {
      content: content,
      senderChatID: senderChatID,
      receiverChatID: receiverChatID,
    });
  });
});

app.use("/auth", AuthRoute);
// app.use("/conversation", ConversationRoute);
app.use("/user", UserRoute);
