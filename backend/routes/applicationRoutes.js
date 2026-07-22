import { Router } from "express";
import {
  createApplication,
  getApplications,
  markRead,
  deleteApplication,
} from "../controllers/applicationController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/", createApplication);
router.get("/", auth, getApplications);
router.patch("/:id/read", auth, markRead);
router.delete("/:id", auth, deleteApplication);

export default router;
