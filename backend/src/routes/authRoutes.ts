import { Router } from 'express';
import {
  createUser,
  signIn,
  authInfo,
  logout,
} from '../controllers/authController';

const router = Router();

router.get('/me', authInfo);
router.post('/register', createUser);
router.post('/login', signIn);
router.post('/logout', logout);

export default router;
