import express from 'express';
import { getAdmin, createAdmin, updateAdmin, removeAdmin }  from '../controllers/admins.js';
const router = express.Router();

router.get("/:adminId", getAdmin)
router.post("/", createAdmin)
router.patch("/:adminId", updateAdmin)
router.delete("/:adminId", removeAdmin)

export default router;
