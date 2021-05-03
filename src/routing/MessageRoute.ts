const express = require("express");
const router = express.Router();
import * as MessageController from "../controller/MessageController";

// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", function (req, res) {
  MessageController.onGetAllMessage(req, res);
});

router.post("/", function (req, res) {
  MessageController.onStoreMessage(req, res);
});

module.exports = router;
