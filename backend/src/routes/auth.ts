import express from 'express';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { AuthController } from '../controllers/AuthController.js';

const router = express.Router();

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

export default router;
