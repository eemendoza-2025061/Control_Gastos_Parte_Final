import { Router } from 'express';
import { IngresoController } from '../controllers/ingreso.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
const ingresoController = new IngresoController();

router.get('/', authenticateJWT, ingresoController.list);
router.post('/', authenticateJWT, ingresoController.create);
router.put('/:id', authenticateJWT, ingresoController.update);
router.delete('/:id', authenticateJWT, ingresoController.remove);
router.get('/total', authenticateJWT, ingresoController.getTotal);

export default router;