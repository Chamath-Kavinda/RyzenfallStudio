import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { initWebSocket } from "./ws/socket.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const origins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/applications", applicationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  const server = http.createServer(app);
  initWebSocket(server);
  server.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
