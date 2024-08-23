import { Router } from "express";
import cron from "node-cron";
import { Order } from "../models/order.mjs";
import { Product } from "../models/product.mjs";
import { Stats } from "../models/stats.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const stats = await Stats.find({});
    const orders = await Order.find({})
      .populate({
        path: "cart",
        populate: {
          path: "cartProducts.product",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);
    const products = await Product.find({});
    res.status(200).json({ stats, orders, products });
  } catch (err) {
    res.status(404).json(err);
  }
});
cron.schedule("0 0 * * 7", () => {
  performWeeklyTreatment();
});

const performWeeklyTreatment = async () => {
  const stats = await Stats.findOne();
  stats.thisWeek = 0;
  stats.weekStats = new Array(7).fill({
    HEADPHONES: 0,
    SPEAKERS: 0,
    EARPHONES: 0,
  });
  await stats.save();
};

export default router;
