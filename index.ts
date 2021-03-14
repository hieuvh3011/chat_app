import {sequelize} from "./src/entities/database";
import createTable from "./src/entities";

const express = require("express");
const dotenv = require("dotenv");
const AuthRoute = require("./src/routing/AuthRoute");

const bodyParser = require("body-parser");

/**
 * end import here
 * Use mixed import in this file
 * */

const app = express();
const DEFAULT_PORT = 5001;
dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;

// app.get("/", (req, res) => {
//   return res.send("ok men");
// });

app.use(bodyParser.json({type: "application/*+json"}));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
app.use("/auth", AuthRoute);

sequelize
  .authenticate()
  .then(async () => {
    await createTable();
  })
  .catch((error) => console.log("error db connection ", error));
