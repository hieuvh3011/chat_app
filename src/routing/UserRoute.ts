const express = require("express");
const router = express.Router();
import * as UserController from "../controller/UserController";
import AuthMiddleware from "../middleware/AuthMiddleware";
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

// router.get("/", AuthMiddleware.isAuth, async function (req, res) {
//   ContactController.onRequestGetAllContact(req, res);
// });

// router.post("/register", async function (req, res) {
//   await EmployeeController.onRequestRegister(req, res);
// });

router.get("/", AuthMiddleware.isAuth, async function (req, res) {
  await UserController.onRequestFindUser(req, res);
});

module.exports = router;
