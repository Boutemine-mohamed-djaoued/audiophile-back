import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import router from "./routes/router.mjs";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

app.use(cookieParser(process.env.COOKIE_SECRET || "secret"));
app.use(
  session({
    secret: process.env.COOKIE_SECRET || "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res) => {
  res.status(200).send("welcom body");
});

app.use("/", router);

app.get("*", (req, res) => {
  res.status(404).send("not found");
});
