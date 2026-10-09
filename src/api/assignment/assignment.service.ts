import { NotFoundError } from '../../errors/not-found.error';
import { AssignmentAlreadyCompletedError } from '../../errors/assignment-already-completed.error';
import classroomSrv from '../classroom/classroom.service';
import { Assignment } from './assignment.entity';
import { AssignmentDocument, AssignmentModel } from './assignment.model';

export class AssignmentService {

    // Come CartItemService.find(userId) nel riferimento: filtro + populate del campo con ref.
    // Qui, prima del filtro, c'è il controllo di accesso alla classe: la può vedere solo
    // il docente che l'ha creata o uno studente iscritto (yaml: altrimenti 404).
    // Basta confrontare l'id con createdBy e con students, senza guardare il ruolo:
    // un docente non è mai in students e uno studente non è mai createdBy.
    async find(classroomId: string, userId: string): Promise<Assignment[]> {
        const classroom = await classroomSrv.getById(classroomId);
        if (!classroom) {
            throw new NotFoundError();
        }

        const isCreator = classroom.createdBy.toString() === userId;
        const isEnrolled = classroom.students.some(studentId => studentId.toString() === userId);
        if (!isCreator && !isEnrolled) {
            throw new NotFoundError();
        }

        const assignments = await AssignmentModel.find({ classroom: classroomId }).populate('createdBy');
        return assignments;
    }

    // Come CartItemService.add(item, userId): aggiungo al dato in ingresso i campi che non
    // arrivano dal client (classroom, createdBy e students), creo e ritorno il documento popolato.
    // Il docente deve essere il creatore della classe (yaml: altrimenti 404).
    // students: copio gli studenti della classe, tutti con completed = false.
    async add(assignment: Pick<Assignment, 'title'>, classroomId: string, teacherId: string): Promise<Assignment> {
        const classroom = await classroomSrv.getById(classroomId);
        if (!classroom || classroom.createdBy.toString() !== teacherId) {
            throw new NotFoundError();
        }

        const toAdd = {
            ...assignment,
            classroom: classroomId,
            createdBy: teacherId,
            students: classroom.students.map(studentId => ({ studentId, completed: false }))
        }
        const newAssignment = await AssignmentModel.create(toAdd);
        return newAssignment.populate('createdBy');
    }

    // Come CartItem _getById(id, userId): filtro sia sull'id che sul collegamento (là user, qui classroom).
    // Con un'unica query copre tre casi: classe inesistente, attività inesistente e attività
    // non collegata a quella classe. In tutti e tre i casi torna null.
    private async _getById(id: string, classroomId: string): Promise<AssignmentDocument | null> {
        const assignment = await AssignmentModel.findOne({ _id: id, classroom: classroomId });
        return assignment ?? null;
    }

    // Come CartItemService.update: recupero il documento, lo modifico e faccio save().
    // NotFoundError: classe/attività inesistenti o non collegate, oppure lo studente non è nella lista.
    // AssignmentAlreadyCompletedError: lo studente ha già completato (come UserExistsError in
    // user.service, è il controller che decide cosa tornare al client: yaml 400).
    async complete(classroomId: string, assignmentId: string, studentId: string): Promise<Assignment> {
        const assignment = await this._getById(assignmentId, classroomId);
        if (!assignment) {
            throw new NotFoundError();
        }

        const student = assignment.students.find(s => s.studentId.toString() === studentId);
        if (!student) {
            throw new NotFoundError();
        }

        if (student.completed) {
            throw new AssignmentAlreadyCompletedError();
        }

        student.completed = true;
        const updated = await assignment.save();

        return updated.populate('createdBy');
    }
}

export default new AssignmentService();