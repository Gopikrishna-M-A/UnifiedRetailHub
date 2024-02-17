import express from 'express';
import { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion }  from '../controllers/promotions.js';
const router = express.Router();

router.post("/", createPromotion)
router.get("/", getPromotions)
router.get("/:promotionId", getPromotion)
router.patch("/:promotionId", updatePromotion)
router.delete("/:promotionId", deletePromotion)

export default router;
