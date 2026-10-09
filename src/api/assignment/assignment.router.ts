import { Router } from "express";
import { add, complete, list } from "./assignment.controller";
import { validate } from "../../lib/validation-middleware";
import { CreateAssignmentDto } from "./assignment.dto";
import { AssignmentIdParams, ClassroomIdParams } from "../../lib/id-params";
import { isStudent, isTeacher } from "../../lib/auth/role.middleware";

// mergeParams: true perché il router è annidato sotto /classrooms/:classroomId/assignments:
// senza, in questo router req.params non conterrebbe classroomId (definito nel router padre).
// Niente isAuthenticated qui: lo applica già classroom.router (router.use(isAuthenticated))
// prima di montare questo router.
const router = Router({ mergeParams: true });

// lo studente/docente che non può vedere la classe riceve 404 dal service, il ruolo non cambia la route
router.get('/', validate(ClassroomIdParams, 'params'), list);
// isTeacher prima di validate: a un non docente si risponde 404 a prescindere dal body
router.post('/', isTeacher, validate(ClassroomIdParams, 'params'), validate(CreateAssignmentDto, 'body'), add);
// isStudent prima di validate: a un non studente si risponde 404 a prescindere dai params
router.patch('/:id', isStudent, validate(AssignmentIdParams, 'params'), complete);

export default router;