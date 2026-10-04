import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const protect = async (req, res, next) => {
  try {
    // Check for token in Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request (from token payload)
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next(); // move to the next middleware or controller
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default protect;
