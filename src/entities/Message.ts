import {DataTypes} from "sequelize";
import {sequelize} from "./database";
import Conversation from "./Conversation";
import User from "./User";

const Message = sequelize.define(
  "message",
  {
    // Model attributes are defined here
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    hashPassword: {
      type: DataTypes.STRING
    }
  },
  {
    underscored: true,
  }
);

Conversation.hasMany(Message);
Message.belongsTo(Conversation);
Message.belongsTo(User, {foreignKey: 'creator_id'})

export default Message;
