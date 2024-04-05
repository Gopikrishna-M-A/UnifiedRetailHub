import express from 'express';
import { addPurchase, getPurchase, deletePurchase, updatePurchase, getPurchases }  from '../controllers/purchase.js';
const router = express.Router();

router.post("/", addPurchase)
router.get("/", getPurchases)
router.get("/:id", getPurchase)
router.delete("/:id", deletePurchase)
router.patch("/:id", updatePurchase)



export default router;
