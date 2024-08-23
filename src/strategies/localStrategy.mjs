import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../models/user.mjs";
import { comparePassword } from "../util/helper.mjs";
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const myUser = await User.findById(id);
    if (!myUser) throw new Error("user not found");
    done(null, myUser);
  } catch (err) {
    done(err, null);
  }
});
export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const myUser = await User.findOne({ username });
      if (!myUser) throw new Error("user not found");
      if (!comparePassword(password, myUser.password)) throw new Error("wrong password");
      done(null, myUser);
    } catch (err) {
      done(err, null);
    }
  })
);
