import express from 'express';
import { createStaticPage, getStaticPages, getStaticPage, updateStaticPage, deleteStaticPage }  from '../controllers/staticPages.js';
const router = express.Router();

router.post("/", createStaticPage)
router.get("/", getStaticPages)
router.get("/:slug", getStaticPage)
router.patch("/:slug", updateStaticPage)
router.delete("/:slug", deleteStaticPage)

export default router;
