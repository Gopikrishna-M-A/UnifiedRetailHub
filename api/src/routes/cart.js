import express from 'express';
import { getCartItems, addCartItem, updateCartItem, removeCartItem, emptyCart }  from '../controllers/cart.js';
const router = express.Router();

router.get("/:userId", getCartItems)
router.post("/:productId/:userId", addCartItem)
router.patch("/:productId/:userId", updateCartItem)
router.delete("/:productId/:userId", removeCartItem)
router.delete("/:userId", emptyCart)

export default router;
