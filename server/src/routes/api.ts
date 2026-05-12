import { Router } from 'express';
import * as bookController from '../controllers/bookController';
import * as authController from '../controllers/authController';
import * as salesController from '../controllers/salesController';

const router = Router();

// Auth
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Books
router.get('/books', bookController.getBooks);
router.post('/books', bookController.addBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

// Logs
router.get('/logs', bookController.getAuditLogs);

// Sales & Stats
router.get('/sales', salesController.getSales);
router.get('/stats', salesController.getStats);

export default router;
