import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, bulkAdd }  from '../controllers/products.js';
const router = express.Router();



router.get("/", getProducts)
router.get("/:productId", getProduct)
router.post("/", createProduct)
router.patch("/:productId", updateProduct)
router.delete("/:productId", deleteProduct)



router.post("/bulk", bulkAdd)

export default router;
