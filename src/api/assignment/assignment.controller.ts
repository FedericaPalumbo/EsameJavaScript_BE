import { Response, NextFunction } from 'express';
import assignmentSrv from './assignment.service';
import { TypedRequest } from '../../lib/typed-request.interface';
import { CreateAssignmentDto } from './assignment.dto';
import { AssignmentIdParams, ClassroomIdParams } from '../../lib/id-params';
import { AssignmentAlreadyCompletedError } from '../../errors/assignment-already-completed.error';
import { AssignmentDocument } from './assignment.model';

// Campi che dipendono dall'utente che chiama l'API (non possono essere virtual): completed e
// completedAt dello studente loggato. Li uso sia in list che in complete.
// Uso doc.toJSON() e NON doc.toObject(): il toJSON dello schema toglie students (tornano solo
// i conteggi), il toObject invece lo lascia e la lista finirebbe nella risposta.
const withStudentFields = (doc: AssignmentDocument, studentId: string) => {
    const mine = doc.students.find(s => s.studentId.toString() === studentId);
    return { ...doc.toJSON(), completed: !!mine?.completed, completedAt: mine?.completedAt };
}

// Come list di cart-item.controller, ma il comportamento cambia a seconda del ruolo
// (la consegna vuole questo controllo nel controller, non in un middleware):
// DOCENTE: le attività con i conteggi. STUDENTE: le stesse attività + il campo completed.
// completed dipende dall'utente che chiama l'API, quindi non può essere un virtual: lo calcolo
// qui dal documento (students contiene { studentId, completed, completedAt }) con withStudentFields.
// Il controllo di accesso alla classe (404) è nel service: se non è lecito lancia NotFoundError.
export const list = async (req: TypedRequest<unknown, unknown, ClassroomIdParams>, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const results = await assignmentSrv.find(req.params.classroomId, user.id);

        if (user.role === 'student') {
            res.json(results.map(doc => withStudentFields(doc, user.id)));
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

// BONUS: dettaglio di una attività per il docente, con l'elenco degli studenti che hanno
// (o non hanno) completato e la data di completamento.
// Il controllo "solo docenti" non è qui: lo fa isTeacher nel router.
// Il controllo "classe creata da questo docente / attività della classe" è nel service (NotFoundError).
// toJSON() dell'attività toglie students, quindi lo rimetto io in forma { student, completed, completedAt }:
// s.studentId è popolato, res.json ne chiama il toJSON (id, fullName, picture...).
export const detail = async (req: TypedRequest<unknown, unknown, AssignmentIdParams>, res: Response, next: NextFunction) => {
    try {
        const { classroomId, id } = req.params;

        const result = await assignmentSrv.getDetail(classroomId, id, req.user!.id);

        res.json({
            ...result.toJSON(),
            students: result.students.map(s => ({
                student: s.studentId,
                completed: s.completed,
                completedAt: s.completedAt
            }))
        });
    } catch (err) {
        next(err);
    }
}

// Come updateQuantity di cart-item.controller, ma con due differenze:
// - il NotFoundError lo lancia già il service (classe/attività inesistenti o non collegate)
// - AssignmentAlreadyCompletedError lo gestisco qui come register con UserExistsError: yaml 400
// Il controllo "solo studenti" non è qui: lo fa isStudent nel router.
// Chi arriva qui è uno studente e l'ha appena completata: withStudentFields torna completed true
// e la data di completamento appena salvata.
export const complete = async (req: TypedRequest<unknown, unknown, AssignmentIdParams>, res: Response, next: NextFunction) => {
    try {
        const { classroomId, id } = req.params;

        const result = await assignmentSrv.complete(classroomId, id, req.user!.id);

        res.json(withStudentFields(result, req.user!.id));
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