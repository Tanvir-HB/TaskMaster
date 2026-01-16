import express from "express";
import { getTodos, createTodo, updateTodo, deleteTodo, getStats } from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .get(getTodos)
    .post(upload.array("attachments"), createTodo); // Handle file upload

router.route("/stats").get(getStats);
router.route("/:id").put(updateTodo).delete(deleteTodo);

export default router;
