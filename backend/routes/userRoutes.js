import { Router } from "express";
import { getUsers, createUser, deleteUser } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth, getUsers);
router.post("/", auth, createUser);
router.delete("/:id", auth, deleteUser);

export default router;
