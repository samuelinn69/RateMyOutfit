import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getProfile, updateProfile, getMe } from '../controllers/users.controller';

const router = Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);
router.get('/:username', getProfile);

export default router;
