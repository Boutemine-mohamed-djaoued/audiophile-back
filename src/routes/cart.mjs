import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { Cart } from "../models/cart.mjs";
import { Order } from "../models/order.mjs";
import { Product } from "../models/product.mjs";
import { Stats } from "../models/stats.mjs";
import { cartValidationSchema, checkoutValidationSchema } from "../util/validationSchemas.mjs";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findById(req.user.cart).populate("cartProducts.product");
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/", checkSchema(cartValidationSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ errors: result.array()[0].msg });

  try {
    const data = matchedData(req);
    const cart = await Cart.findById(req.user.cart);
    let productFound = false;
    for (const cartProduct of cart.cartProducts) {
      if (cartProduct.product == data.productId) {
        productFound = true;
        const myProduct = await Product.findById(data.productId);
        if (data.quantity > myProduct.inStock) {
          return res.status(400).send("Not Enough Stock");
        }
        myProduct.inStock -= data.quantity;
        cartProduct.quantity += data.quantity;
        await myProduct.save();
        if (cartProduct.quantity <= 0) {
          cart.cartProducts = cart.cartProducts.filter((cartProduct) => cartProduct.product != data.productId);
        }
        await cart.save();
        return res.status(200).send("Product quantity changed in cart");
      }
    }

    if (!productFound) {
      if (data.quantity <= 0) {
        return res.status(400).send("Quantity must be greater than 0");
      }
      const myProduct = await Product.findById(data.productId);
      if (data.quantity > myProduct.inStock) {
        return res.status(400).send("Not enough stock");
      }
      myProduct.inStock -= data.quantity;
      await myProduct.save();
      cart.cartProducts.push({ product: data.productId, quantity: data.quantity });
      await cart.save();
      return res.status(200).send("Product added to cart");
    }
  } catch (err) {
    return res.status(400).send("Failed to add product to cart");
  }
});

router.post("/checkout", checkSchema(checkoutValidationSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ errors: result.array()[0].msg });
  try {
    const data = matchedData(req);
    const cart = await Cart.findById(req.user.cart).populate("cartProducts.product");
    let totalCost = 50;
    let productsSold = 0;
    let pieces = {
      HEADPHONES: 0,
      SPEAKERS: 0,
      EARPHONES: 0,
    };
    if (data.paymentMethod === "e-money") {
      for (let cartProduct of cart.cartProducts) {
        const product = cartProduct.product;
        totalCost += product.price * cartProduct.quantity;
      }
      if (req.user.balance < totalCost) return res.status(400).send("not enought balance");
      req.user.balance -= totalCost;
    }
    for (let cartProduct of cart.cartProducts) {
      const product = cartProduct.product;
      productsSold += cartProduct.quantity;
      pieces[product.category] += cartProduct.quantity;
    }
    const order = new Order({ ...data, client: req.user._id, cart: cart._id });
    const stats = await Stats.findOne();
    stats.total += totalCost;
    stats.thisWeek += totalCost;
    stats.totalSold += productsSold;
    let date = new Date().getDay();
    stats.weekStats[date].HEADPHONES += pieces.HEADPHONES;
    stats.weekStats[date].SPEAKERS += pieces.SPEAKERS;
    stats.weekStats[date].EARPHONES += pieces.EARPHONES;
    await stats.save();
    const newCart = new Cart({ cartProducts: [] });
    req.user.cart = newCart._id;
    newCart.save();
    await req.user.save();
    await order.save();
    res.status(200).json({newBalance : req.user.balance});
  } catch (err) {
    res.status(400).send("checkout failed");
  }
});

router.delete("/", async (req, res) => {
  try {
    const cart = await Cart.findById(req.user.cart);
    for (let cartProduct of cart.cartProducts) {
      const product = await Product.findById(cartProduct.product);
      product.inStock += cartProduct.quantity;
      await product.save();
    }
    cart.cartProducts = [];
    await cart.save();
    res.sendStatus(200)
  } catch (err) {
    res.status(400).send("Error clearing cart");
  }
});

export default router;
