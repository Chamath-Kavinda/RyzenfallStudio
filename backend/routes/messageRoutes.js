import { Router } from "express";
import {
  createMessage,
  getMessages,
  markRead,
  deleteMessage,
} from "../controllers/messageController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/", createMessage);
router.get("/", auth, getMessages);
router.patch("/:id/read", auth, markRead);
router.delete("/:id", auth, deleteMessage);

export default router;
