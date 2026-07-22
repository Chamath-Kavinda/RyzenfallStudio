import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, admin: { id: admin._id, email: admin.email } });
}
