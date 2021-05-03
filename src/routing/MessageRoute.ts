const express = require("express");
const router = express.Router();
import * as MessageController from "../controller/MessageController";
import AuthMiddleware from "../middleware/AuthMiddleware";
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", AuthMiddleware.isAuth, function (req, res) {
  MessageController.onGetAllMessage(req, res);
});

router.post("/", AuthMiddleware.isAuth, function (req, res) {
  MessageController.onStoreMessage(req, res);
});

module.exports = router;
