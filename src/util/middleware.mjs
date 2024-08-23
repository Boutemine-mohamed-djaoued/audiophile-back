export const logedInMiddleware = (req, res, next) => {
  console.log(req.user);
  console.log(req.session)
  console.log(req.isAuthenticated());
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not Authorized");
  }
  next();
};
export const IsAdminMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) return res.status(401).send("Not Authorized");
  if (req.user.role !== "admin") return res.status(401).send("Not Authorized");
  next();
};
