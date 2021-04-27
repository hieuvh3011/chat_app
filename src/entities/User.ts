import mongoose from "../repository/database";

const { Schema } = mongoose;

const userSchema = new Schema({
  full_name: String,
  avatar: { type: String, default: "" },
  password: String,
  email: String,
  contact_id: { type: Array, default: [] },
  phone: String,
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

userSchema.index({ full_name: "text", email: "text" });
userSchema.method('transform', function() {
  const obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});
module.exports = mongoose.model("User", userSchema, "user");
