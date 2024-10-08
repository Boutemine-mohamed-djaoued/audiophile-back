import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Cart } from "../models/cart.mjs";
import { User } from "../models/user.mjs";
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
      callbackURL: `${process.env.BACKEND_URL}/user/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        console.log({ user });
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
        console.log({ user });
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
