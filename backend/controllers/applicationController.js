import { Application } from "../models/Application.js";
import { broadcast } from "../ws/socket.js";

export async function createApplication(req, res) {
  const { solution, item, projectName, name, email, description } = req.body;
  if (!projectName || !email || !description)
    return res.status(400).json({ message: "Project name, email and description are required" });

  const doc = await Application.create({ solution, item, projectName, name, email, description });
  broadcast("application:created", doc);
  res.status(201).json(doc);
}

export async function getApplications(req, res) {
  const applications = await Application.find().sort({ createdAt: -1 });
  res.json(applications);
}

export async function markRead(req, res) {
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!application) return res.status(404).json({ message: "Application not found" });
  res.json(application);
}

export async function deleteApplication(req, res) {
  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) return res.status(404).json({ message: "Application not found" });
  res.json({ _id: application._id });
}
