import { Sequelize } from "sequelize";
import * as mysql2 from 'mysql2';

const _host = process.env.DB_HOST_NAME || "127.0.0.1";
const _name = process.env.DB_NAME || "messenger";
const _username = process.env.DB_USER || "root";
const _password = process.env.PASSWORD || "hieu1995";

export const sequelize = new Sequelize(_name, _username, _password, {
  dialect: "mysql",
  dialectModule: mysql2,
  host: _host,
});

module.exports = {
  sequelize,
};
