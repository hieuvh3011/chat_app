import mongoose from "../repository/database";

const { Schema } = mongoose;

const conversationSchema = new Schema({
  receiver_id: String,
});

conversationSchema.index({ full_name: "text", email: "text" });

module.exports = mongoose.model(
  "Conversation",
  conversationSchema,
  "conversation"
);
