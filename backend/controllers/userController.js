import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";

export async function getUsers(req, res) {
  const users = await Admin.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
}

export async function createUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });
  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  const normalized = email.toLowerCase().trim();
  const exists = await Admin.findOne({ email: normalized });
  if (exists) return res.status(409).json({ message: "A user with that email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email: normalized, password: hashed });
  res.status(201).json({ _id: admin._id, email: admin.email, createdAt: admin.createdAt });
}

export async function deleteUser(req, res) {
  if (req.admin.id === req.params.id)
    return res.status(400).json({ message: "You can't delete your own account" });

  const count = await Admin.countDocuments();
  if (count <= 1) return res.status(400).json({ message: "At least one admin must remain" });

  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) return res.status(404).json({ message: "User not found" });
  res.json({ _id: admin._id });
}
