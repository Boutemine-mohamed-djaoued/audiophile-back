import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

export const comparePassword = (plain, hashed) => {
  return bcrypt.compareSync(plain, hashed);
};
