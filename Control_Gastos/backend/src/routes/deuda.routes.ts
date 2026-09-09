import { Router } from 'express';
import { DeudaController } from '../controllers/deuda.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
const deudaController = new DeudaController();

router.get('/', authenticateJWT, deudaController.list);
router.post('/', authenticateJWT, deudaController.create);
router.put('/:id', authenticateJWT, deudaController.update);
router.delete('/:id', authenticateJWT, deudaController.remove);

router.post('/pagos', authenticateJWT, deudaController.createPago);
router.put('/pagos/:id', authenticateJWT, deudaController.updatePago);
router.delete('/pagos/:id', authenticateJWT, deudaController.removePago);

export default router;