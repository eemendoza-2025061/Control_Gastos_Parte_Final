import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();
const controller = new UserController();
router.use(authenticateJWT, requireRole('admin'));
router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
export default router;