import { Router } from 'express';
import { AhorroController } from '../controllers/ahorro.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
const ahorroController = new AhorroController();

router.get('/', authenticateJWT, ahorroController.list);
router.post('/', authenticateJWT, ahorroController.create);
router.put('/:id', authenticateJWT, ahorroController.update);
router.delete('/:id', authenticateJWT, ahorroController.remove);

export default router;