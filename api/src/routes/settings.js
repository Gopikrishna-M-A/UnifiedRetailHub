import express from 'express';
import { getAllSettings, getSettingValue, updateSettingValue }  from '../controllers/settings.js';
const router = express.Router();

router.get("/", getAllSettings)
router.get("/:settingKey", getSettingValue)
router.patch("/:settingKey", updateSettingValue)

export default router;
