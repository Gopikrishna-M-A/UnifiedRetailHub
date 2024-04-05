import express from 'express';
import { addVendor, getVendor, deleteVendor, updateVendor, getVendors }  from '../controllers/vendor.js';
const router = express.Router();

router.post("/", addVendor)
router.get("/", getVendors)
router.get("/:id", getVendor)
router.delete("/:id", deleteVendor)
router.patch("/:id", updateVendor)



export default router;
