import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/logout', authController.logout);
router.get('/me', authenticateJWT, authController.getMe);
router.put('/savings-goal', authenticateJWT, authController.updateSavingsGoal);

export default router;