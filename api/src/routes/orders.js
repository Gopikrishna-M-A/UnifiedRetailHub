import express from 'express';
import { getAllOrders, createOrder, getOrderDetails, updateOrder, getOrderHistory, verifyOrder, statusUpdate }  from '../controllers/orders.js';
const router = express.Router();

router.get("/", getAllOrders)
router.post("/", createOrder)
router.post("/verify", verifyOrder)
router.get("/:orderId", getOrderDetails)
router.patch("/:orderId/status", updateOrder)
router.get("/history/:userId", getOrderHistory)

router.post("/statusUpdate/:orderId", statusUpdate)

export default router;


