import {DataTypes} from "sequelize";
import {sequelize} from "./database";
import User from "./User";
import Contact from "./Contact";

const UserContact = sequelize.define(
  "user_contact",
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
    }
  },
  {
    underscored: true,
  }
);

User.belongsToMany(Contact, { through: UserContact });
Contact.belongsToMany(User, { through: UserContact });

export default UserContact;
