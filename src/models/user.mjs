import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  role : {
    type: String,
    enum: ["user", "admin"],
    default : "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
  },
  googleId: {
    type: String,
  },
});

export const User = mongoose.model("user", userSchema);
