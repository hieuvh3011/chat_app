const express = require("express");
const router = express.Router();
import UserController from "../controller/UserController";

// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", function (req, res) {
  res.send("Ok men 2");
});

router.post("/login", async function (req, res) {
  await UserController.onLogin(req, res);
});

router.post("/register", async function (req, res) {
  await UserController.onRegister(req, res);
});

module.exports = router;
