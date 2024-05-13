import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, bulkAdd, testRoute }  from '../controllers/products.js';
const router = express.Router();



router.get("/", getProducts)
router.get("/:productId", getProduct)
router.post("/", createProduct)
router.patch("/:productId", updateProduct)
router.delete("/:productId", deleteProduct)




router.post("/bulk", bulkAdd)

router.post("/test-route", testRoute)




export default router;
