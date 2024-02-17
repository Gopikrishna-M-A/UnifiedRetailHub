import express from 'express';
import { createOrder, verifyOrder }  from '../controllers/payments.js';
const router = express.Router();

router.post("/create-order", createOrder)
router.post("/verify-payment", verifyOrder)

export default router;
