import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  cartProducts: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
export const Cart = mongoose.model("cart", cartSchema);
