import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { User } from "../models/user.mjs";
import { Cart } from "../models/cart.mjs";
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("user not found");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/user/google/callback",
    },
    async function (accessToken, refreshToken,profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const cart = new Cart();
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.email,
            password: "google",
            cart: cart._id,
          });
          await cart.save();
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
