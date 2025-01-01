import express from 'express';
import { getUserSettings, updateSettings, resetSettings } from '../controllers/settings.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// All settings routes require authentication
router.use(protectRoute);

router.get('/', getUserSettings);
router.put('/', updateSettings);
router.post('/reset', resetSettings);

export default router;