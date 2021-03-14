import {DataTypes} from "sequelize";
import {sequelize} from "./database";

const Contact = sequelize.define(
  "contact",
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
    phoneNumber: {
      type: DataTypes.STRING,
    },
  },
  {
    underscored: true,
  }
);

export default Contact;
