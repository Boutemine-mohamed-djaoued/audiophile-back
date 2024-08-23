import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["HEADPHONES", "SPEAKERS", "EARPHONES"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: [String],
    inBox: [
      {
        item: String,
        quantity: Number,
      },
    ],
    mainImage: {
      type: String,
      required: true,
    },
    otherImages: [String],
    inStock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Product = mongoose.model("product", productSchema);
