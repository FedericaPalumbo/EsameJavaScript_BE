import { Router } from "express";
import authRouter from './auth/auth.router';
import userRouter from './user/user.router';

const router = Router();
router.use('/users', userRouter);
router.use(authRouter);

export default router;