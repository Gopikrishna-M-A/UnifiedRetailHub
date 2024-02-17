import express from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory }  from '../controllers/categories.js';
const router = express.Router();

router.get("/", getCategories)
router.post("/", createCategory)
router.get("/:categoryId", getCategory)
router.patch("/:categoryId", updateCategory)
router.delete("/:categoryId", deleteCategory)

export default router;
