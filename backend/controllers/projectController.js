import { Project } from "../models/Project.js";
import { uploadImage, deleteImage } from "../config/supabase.js";
import { broadcast } from "../ws/socket.js";

function parseTechStack(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Fall back to comma-separated input.
  }
  return value.split(",").map((t) => t.trim()).filter(Boolean);
}

export async function getProjects(req, res) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const projects = await Project.find(filter).sort({ createdAt: -1 });
  res.json(projects);
}

export async function createProject(req, res) {
  const { title, category, description, link, featured } = req.body;
  const techStack = parseTechStack(req.body.techStack);

  let image = "";
  if (req.file) image = await uploadImage(req.file.buffer, req.file.mimetype, req.file.originalname);

  const project = await Project.create({
    title,
    category,
    description,
    techStack,
    link,
    image,
    featured: featured === "true" || featured === true,
  });

  broadcast("project:created", project);
  res.status(201).json(project);
}

export async function updateProject(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const { title, category, description, link, featured } = req.body;
  if (title !== undefined) project.title = title;
  if (category !== undefined) project.category = category;
  if (description !== undefined) project.description = description;
  if (link !== undefined) project.link = link;
  if (featured !== undefined) project.featured = featured === "true" || featured === true;
  if (req.body.techStack !== undefined) project.techStack = parseTechStack(req.body.techStack);

  if (req.file) {
    const oldImage = project.image;
    project.image = await uploadImage(req.file.buffer, req.file.mimetype, req.file.originalname);
    await deleteImage(oldImage);
  }

  await project.save();
  broadcast("project:updated", project);
  res.json(project);
}

export async function deleteProject(req, res) {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  await deleteImage(project.image);
  broadcast("project:deleted", { _id: project._id });
  res.json({ _id: project._id });
}
