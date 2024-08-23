import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { Product } from "../models/product.mjs";
import { IsAdminMiddleware } from "../util/middleware.mjs";
import { productValidationSchema } from "../util/validationSchemas.mjs";
const router = Router();


router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get("/categories/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.use(IsAdminMiddleware);

router.post("/", checkSchema(productValidationSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ errors: result.array()[0].msg });
  try {
    const data = matchedData(req);
    const product = new Product(data);
    await product.save();
    res.status(201).send("Product created");
  } catch (err) {
    res.status(400).send("Error creating product");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(201).send("Product deleted");
  } catch (err) {
    res.status(400).send("Error deleting product");
  }
});

router.put("/:id", checkSchema(productValidationSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ errors: result.array()[0].msg });
  try {
    const data = matchedData(req);
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!product) return res.status(404).send("Product not found");
    res.status(201).send("Product updated");
  } catch (err) {
    res.status(400).send("Error updating product");
  }
});
export default router;
