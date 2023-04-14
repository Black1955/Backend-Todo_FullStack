import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s/, "");
    if (token) {
      const decoded = jwt.decode(token, "Oleg");
      req.userID = decoded;
      // console.log(req.userID)
      next();
    } else {
      return res.status(404).json({ message: "invalid token" });
    }
  } catch (e) {
    res.status(404).json({ message: "error" });
  }
};
export default checkAuth;
