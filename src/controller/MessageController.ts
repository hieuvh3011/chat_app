import ContactDTO from "../dto/ContactDTO";
import { getUserIdFromToken, getUserById } from "./UserController";
import ResponseForm from "../helper/ResponseForm";
import * as CODE from "../helper/Code";
import MessageDTO from "../dto/MessageDTO";
const Message = require("../entities/Message");

export const storeMessage = async (message: MessageDTO): Promise<any> => {
  await Message.save(message);
};
