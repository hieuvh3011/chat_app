import {DataTypes} from "sequelize";
import {sequelize} from "./database";
import Message from "./Message";

const Conversation = sequelize.define(
  "conversation",
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
  }
);

export default Conversation;
