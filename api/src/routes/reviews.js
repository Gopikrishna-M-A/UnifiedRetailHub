import express from 'express';
import { createReview, getReviews, getReview, updateReview, deleteReview }  from '../controllers/reviews.js';
const router = express.Router();

router.post("/", createReview)
router.get("/product/:productId", getReviews)
router.get("/:reviewId", getReview)
router.patch("/:reviewId", updateReview)
router.delete("/:reviewId", deleteReview)

export default router;
