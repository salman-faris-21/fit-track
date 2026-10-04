import db from "../configs/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    //find user by mail
    const [mail] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (mail.length === 0) {
      return res.status(404).json({ error: "user not exist" });
    }
    const user = mail[0];
    //password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    //token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },

      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default login;
