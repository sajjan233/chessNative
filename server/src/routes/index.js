import {Router} from 'express'
import api from './api/index.js';
import authRoutes from './authRoutes.js';
const router = Router();

router.use('/api',api)
// router.use('/auth')
router.use('/auth', authRoutes); // base URL: /auth/register, /auth/login

export default router;
