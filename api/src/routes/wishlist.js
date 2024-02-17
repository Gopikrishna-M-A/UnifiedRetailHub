import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist }  from '../controllers/wishlist.js';
const router = express.Router();


router.get("/:userId", getWishlist)
router.post("/:productId/:userId", addToWishlist)
router.delete("/:productId/:userId", removeFromWishlist)

export default router;
