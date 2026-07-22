import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    solution: { type: String, trim: true, default: "" },
    item: { type: String, trim: true, default: "" },
    projectName: { type: String, required: true, trim: true },
    name: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
