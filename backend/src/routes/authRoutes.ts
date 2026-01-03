import { Router } from 'express';
import {
  createUser,
  signIn,
  authInfo,
  logout,
  resetPassword,
} from '../controllers/authController';

const router = Router();

router.get('/me', authInfo);
router.post('/register', createUser);
router.post('/login', signIn);
router.post('/logout', logout);
router.put('/reset-password', resetPassword);

export default router;
