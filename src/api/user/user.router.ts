import { Router } from "express";
import { list } from "./user.controller";
import { validate } from "../../lib/validation-middleware";
import { QueryUserDto } from "./user.dto";
import { isAuthenticated } from "../../lib/auth/authenticated.middleware";

const router = Router();

router.use(isAuthenticated);
router.get('/', validate(QueryUserDto, 'query'), list);

export default router;