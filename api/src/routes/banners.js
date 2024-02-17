import express from 'express';
import { createBanner, getBanners, getBanner, updateBanner, deleteBanner }  from '../controllers/banners.js';
const router = express.Router();

router.post("/", createBanner)
router.get("/", getBanners)
router.get("/:bannerId", getBanner)
router.patch("/:bannerId", updateBanner)
router.delete("/:bannerId", deleteBanner)

export default router;
