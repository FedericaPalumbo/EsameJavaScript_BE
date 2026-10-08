import { Router } from "express";
import { validate } from "../../lib/validation-middleware";
import { RegisterDto } from "./auth.dto";
import { register } from "./auth.controller";

const router = Router();

router.post('/register', validate(RegisterDto, 'body'), register);

export default router;