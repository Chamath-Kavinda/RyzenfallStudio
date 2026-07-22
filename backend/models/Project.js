import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ["website", "game"], required: true },
    description: { type: String, required: true, trim: true },
    techStack: { type: [String], default: [] },
    link: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
