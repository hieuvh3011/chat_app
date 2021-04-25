// import AuthMiddleware from "../middleware/AuthMiddleware";
//
// const express = require("express");
// const router = express.Router();
// import {
//   onRequestGetAllConversation,
//   onRequestCreateConversation,
// } from "../controller/ConversationController";
//
// // router.use(function timeLog(req, res, next) {
// //   console.log("Time: ", Date.now());
// //   next();
// // });
//
// router.get("/", AuthMiddleware.isAuth, async function (req, res) {
//   onRequestGetAllConversation(req, res);
// });
//
// router.post("/", AuthMiddleware.isAuth, async function (req, res) {
//   await onRequestCreateConversation(req, res);
// });
//
// module.exports = router;
