import { Router } from 'express';
import {
  createUser,
  signIn,
  authInfo,
  logout,
  resetPassword,
  generateTotp,
  verifyTotp,
  disableTotp,
  loginWithTotp,
} from '../controllers/authController';

const router = Router();

router.get('/me', authInfo);
router.post('/register', createUser);
router.post('/login', signIn);
router.post('/logout', logout);
router.put('/reset-password', resetPassword);
router.get('/generate-totp', generateTotp);
router.post('/verify-totp', verifyTotp);
router.post('/disable-totp', disableTotp);
router.post('/login-with-totp', loginWithTotp);

export default router;
