import mongoose from "../repository/database";

const { Schema } = mongoose;

const messageSchema = new Schema({
  room_id: { type: String, default: "" },
  sender_id: String,
  receiver_id: String,
  content: String,
  image: String,
  message_status: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

messageSchema.index({ message_body: "text" });

module.exports = mongoose.model("Message", messageSchema, "message");
