import { Message } from "../models/Message.js";

export async function createMessage(req, res) {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ message: "All fields are required" });

  const doc = await Message.create({ name, email, subject, message });
  res.status(201).json(doc);
}

export async function getMessages(req, res) {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
}

export async function markRead(req, res) {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!message) return res.status(404).json({ message: "Message not found" });
  res.json(message);
}

export async function deleteMessage(req, res) {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ message: "Message not found" });
  res.json({ _id: message._id });
}
