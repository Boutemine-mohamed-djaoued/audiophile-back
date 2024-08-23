import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import passport from "passport";
import { Cart } from "../models/cart.mjs";
import { User } from "../models/user.mjs";
import "../strategies/googleStrategy.mjs";
import "../strategies/localStrategy.mjs";
import { hashPassword } from "../util/helper.mjs";
import { logedInMiddleware } from "../util/middleware.mjs";
import { userValidationSchema } from "../util/validationSchemas.mjs";
const router = Router();

// standard auth
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    req.logIn(user, () => {
      const { _id, username, balance, email, cart, role } = user;
      res.status(200).json({ _id, username, balance, email, cart, role });
    });
  })(req, res, next);
});

// registeration
router.post("/register", checkSchema(userValidationSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send("invalid");
  try {
    const data = matchedData(req);
    const userName = await User.findOne({ username: data.username });
    if (userName) return res.status(400).send("username already exists");
    const userEmail = await User.findOne({ email: data.email });
    if (userEmail) return res.status(400).send("email already exists");
    data.password = await hashPassword(data.password);
    const cart = new Cart();
    await cart.save();
    data.cart = cart._id;
    const user = new User(data);
    await user.save();
    res.sendStatus(201);
  } catch (err) {
    res.status(401).send("failed to register");
  }
});
// google auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

// protected routes
router.use(logedInMiddleware);

router.get("/status", (req, res) => {
  const { _id, username, balance, email, cart, role } = req.user;
  res.status(200).json({ _id, username, balance, email, cart, role });
});

router.post("/addBalance", (req, res) => {
  try {
    const amount = parseInt(req.body.amount);
    if (!amount || amount < 0) return res.status(400).send("invalid amount");
    req.user.balance += parseInt(amount);
    req.user.save();
    res.sendStatus(200)
  } catch (err) {
    res.status(400).send("failed to update balance");
  }
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(400).send("failed to logout");
  });
  res.sendStatus(200);
});
export default router;
