import {sequelize} from "./database";
import Contact from "./Contact";
import Conversation from "./Conversation";
import Message from "./Message";
import User from "./User";
import UserContact from "./UserContact";

const createTable = async (): Promise<void> => {
  await Contact.sync({alter: true});
  await Conversation.sync({alter: true});
  await Message.sync({alter: true});
  await User.sync({alter: true});
  await UserContact.sync({alter: true});
};

export default createTable;
