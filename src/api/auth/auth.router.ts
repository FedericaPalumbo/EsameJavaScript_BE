import { Router } from "express";
import { validate } from "../../lib/validation-middleware";
import { LoginDto, RegisterDto } from "./auth.dto";
import { login, register } from "./auth.controller";

const router = Router();

router.post('/register', validate(RegisterDto, 'body'), register);
router.post('/login', validate(LoginDto, 'body'), login);

export default router;