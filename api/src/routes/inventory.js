import express from 'express';
import { getInventoryItems, getInventoryItem, updateInventoryItem }  from '../controllers/inventory.js';
const router = express.Router();

router.get("/", getInventoryItems)
router.get("/:inventoryItemId", getInventoryItem)
router.patch("/:inventoryItemId", updateInventoryItem)

export default router;










