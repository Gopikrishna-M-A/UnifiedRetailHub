import express from 'express';
import { getAllOrders, createOrder, getOrderDetails, updateOrder, getOrderHistory, verifyOrder, statusUpdate, statusRemove, createPosOrder }  from '../controllers/orders.js';
const router = express.Router();

router.get("/", getAllOrders)
router.post("/", createOrder)
router.post("/verify", verifyOrder)
router.post("/posOrder", createPosOrder)
router.get("/:orderId", getOrderDetails)
router.patch("/:orderId", updateOrder)
router.get("/history/:userId", getOrderHistory)

router.post("/statusUpdate/:orderId", statusUpdate)
router.post("/statusRemove/:orderId", statusRemove)

export default router;


