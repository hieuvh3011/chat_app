import {DataTypes} from "sequelize";
import {sequelize} from "./database";

const User = sequelize.define(
  "user",
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

export default User;
