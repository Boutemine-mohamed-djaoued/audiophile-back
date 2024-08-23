import mongoose from "mongoose";
const statsSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
  },
  thisWeek: {
    type: Number,
    required: true,
  },
  totalSold: {
    type: Number,
    required: true,
  },
  weekStats: [
    {
      HEADPHONES: {
        type: Number,
        required: true,
      },
      SPEAKERS : {
        type: Number,
        required: true,
      },
      EARPHONES: {
        type: Number,
        required: true,
      },
    },
  ],
});
export const Stats = mongoose.model("stats", statsSchema);
