import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  uploadOutfit,
  getOutfit,
  getUserOutfits,
  likeOutfit,
  deleteOutfit,
} from '../controllers/outfits.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Upload limit reached. Try again in an hour.' },
});

router.post('/', authenticate, uploadLimiter, upload.single('image'), uploadOutfit);
router.get('/:id', optionalAuth, getOutfit);
router.delete('/:id', authenticate, deleteOutfit);
router.post('/:id/like', authenticate, likeOutfit);
router.get('/user/:username', optionalAuth, getUserOutfits);

export default router;
