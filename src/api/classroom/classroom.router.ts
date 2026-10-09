import { Router } from "express";
import { add, list } from "./classroom.controller";
import { validate } from "../../lib/validation-middleware";
import { CreateClassroomDto } from "./classroom.dto";
import { isAuthenticated } from "../../lib/auth/authenticated.middleware";
import { isTeacher } from "../../lib/auth/role.middleware";
import assignmentRouter from "../assignment/assignment.router";

const router = Router();

router.use(isAuthenticated);
router.get('/', list);
// isTeacher prima di validate: a un non docente si risponde 404 a prescindere dal body
router.post('/', isTeacher, validate(CreateClassroomDto, 'body'), add);
router.use(['/:classroomId/assignments', '/:classroomId/assigments'], assignmentRouter);

export default router;