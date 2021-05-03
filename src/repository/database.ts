const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const dbUrl = `mongodb+srv://hieuvh301195:${DB_PASSWORD}@chating-app.lb4y7.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.Promise = global.Promise;
mongoose.connect(
  dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    console.log("mongoose connect error = ", err);
  }
);

export default mongoose;
