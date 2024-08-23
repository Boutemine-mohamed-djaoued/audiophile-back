import { Router } from "express";
import { IsAdminMiddleware, logedInMiddleware } from "../util/middleware.mjs";
import cartRouter from "./cart.mjs";
import productRouter from "./product.mjs";
import userRouter from "./user.mjs";
import statsRouter from "./stats.mjs";
const router = Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use(logedInMiddleware);
router.use("/cart", cartRouter);
router.use(IsAdminMiddleware);
router.use("/stats", statsRouter);
export default router;
