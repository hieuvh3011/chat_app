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
dotenv.config();

app.use(bodyParser.json({ type: "application/*+json" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.use("/auth", AuthRoute);
// app.use("/conversation", ConversationRoute);
app.use("/user", UserRoute);
