import { Router } from 'express';
import { EgresoController } from '../controllers/egreso.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
const egresoController = new EgresoController();

router.get('/', authenticateJWT, egresoController.list);
router.post('/', authenticateJWT, egresoController.create);

router.post('/categorias', authenticateJWT, egresoController.createCategoria);
router.put('/categorias/:id', authenticateJWT, egresoController.updateCategoria);
router.delete('/categorias/:id', authenticateJWT, egresoController.removeCategoria);

router.put('/:id', authenticateJWT, egresoController.update);
router.delete('/:id', authenticateJWT, egresoController.remove);

export default router;