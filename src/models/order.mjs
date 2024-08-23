import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["e-money", "cash-on-delivery"],
      required: true,
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "cart", required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model("order", orderSchema);
