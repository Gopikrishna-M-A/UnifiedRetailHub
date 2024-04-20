import express from 'express';
import { createAnalytics, getAllAnalytics, getAnalytics, updateAnalytics, deleteAnalytics }  from '../controllers/analytics.js';
const router = express.Router();

router.post("/", createAnalytics)
router.get("/:userId", getAllAnalytics)
router.get("/:eventId", getAnalytics)
router.patch("/:eventId", updateAnalytics)
router.delete("/:eventId", deleteAnalytics)

export default router;
