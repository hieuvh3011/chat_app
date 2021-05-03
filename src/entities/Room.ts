import mongoose from "../repository/database";

const { Schema } = mongoose;

const roomSchema = new Schema({
  name: { type: String, lowercase: true, unique: true },
  topic: String,
  users: { type: Array, default: [] },
  messages: { type: Array, default: [] },
  created_at: Date,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", roomSchema, "room");
