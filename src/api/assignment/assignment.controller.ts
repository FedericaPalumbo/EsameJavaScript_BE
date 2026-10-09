import { Response, NextFunction } from 'express';
import assignmentSrv from './assignment.service';
import { TypedRequest } from '../../lib/typed-request.interface';
import { CreateAssignmentDto } from './assignment.dto';
import { AssignmentIdParams, ClassroomIdParams } from '../../lib/id-params';
import { AssignmentAlreadyCompletedError } from '../../errors/assignment-already-completed.error';

// Come list di cart-item.controller, ma il comportamento cambia a seconda del ruolo
// (la consegna vuole questo controllo nel controller, non in un middleware):
// DOCENTE: le attività con i conteggi. STUDENTE: le stesse attività + il campo completed.
// completed dipende dall'utente che chiama l'API, quindi non può essere un virtual: lo calcolo
// qui dal documento (students contiene { studentId, completed }) e lo aggiungo al risultato.
// Uso doc.toJSON() e NON doc.toObject(): il toJSON dello schema toglie students (tornano solo
// i conteggi), il toObject invece lo lascia e la lista finirebbe nella risposta.
// Il controllo di accesso alla classe (404) è nel service: se non è lecito lancia NotFoundError.
export const list = async (req: TypedRequest<unknown, unknown, ClassroomIdParams>, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const results = await assignmentSrv.find(req.params.classroomId, user.id);

        if (user.role === 'student') {
            const withCompleted = results.map(doc => {
                const completed = doc.students.some(s => s.studentId.toString() === user.id && s.completed);
                return { ...doc.toJSON(), completed };
            });
            res.json(withCompleted);
        } else {
            res.json(results);
        }
    } catch (err) {
        next(err);
    }
}

// Come add di classroom.controller: lo yaml prevede 201 per POST /classrooms/{classroomId}/assignments.
// Il controllo "solo docenti" non è qui: lo fa isTeacher nel router.
// Il controllo "classe esistente e creata da questo docente" è nel service (NotFoundError).
export const add = async (req: TypedRequest<CreateAssignmentDto, unknown, ClassroomIdParams>, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;

        const result = await assignmentSrv.add({ title }, req.params.classroomId, req.user!.id);

        res.status(201);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

// Come updateQuantity di cart-item.controller, ma con due differenze:
// - il NotFoundError lo lancia già il service (classe/attività inesistenti o non collegate)
// - AssignmentAlreadyCompletedError lo gestisco qui come register con UserExistsError: yaml 400
// Il controllo "solo studenti" non è qui: lo fa isStudent nel router.
// Chi arriva qui è uno studente e l'ha appena completata, quindi completed è true.
export const complete = async (req: TypedRequest<unknown, unknown, AssignmentIdParams>, res: Response, next: NextFunction) => {
    try {
        const { classroomId, id } = req.params;

        const result = await assignmentSrv.complete(classroomId, id, req.user!.id);

        res.json({ ...result.toJSON(), completed: true });
    } catch (err) {
        if (err instanceof AssignmentAlreadyCompletedError) {
            res.status(400);
            res.json({
                error: err.name,
                message: err.message
            });
        } else {
            next(err);
        }
    }
}