import { AssignmentAlreadyCompletedError } from '../../errors/assignment-already-completed.error';
import { Assignment } from './assignment.entity';
import { AssignmentDocument, AssignmentModel } from './assignment.model';

export class AssignmentService {

    // Come CartItemService.find(userId) nel riferimento: filtro + populate del campo con ref.
    // Il controllo di accesso alla classe (404) NON è qui: lo fa il controller prima di chiamare
    // il service, come add di cart-item.controller con productSrv.getById.
    async find(classroomId: string): Promise<AssignmentDocument[]> {
        const assignments = await AssignmentModel.find({ classroom: classroomId }).populate('createdBy');
        return assignments;
    }

    // Come CartItemService.add(item, userId): aggiungo al dato in ingresso il campo che non
    // arriva dal client (createdBy, là user), creo e ritorno il documento popolato.
    // classroom e students li costruisce il controller (come quantity e product in cart-item.controller).
    async add(assignment: Pick<Assignment, 'title' | 'classroom' | 'students'>, teacherId: string): Promise<Assignment> {
        const toAdd = {
            ...assignment,
            createdBy: teacherId
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

    // Come CartItemService.getById: torna null se non trova nulla, sarà il controller a lanciare NotFoundError.
    // Popolo createdBy e students.studentId: servono i dati degli studenti (nome, foto), non solo gli id.
    async getDetail(classroomId: string, assignmentId: string): Promise<AssignmentDocument | null> {
        const assignment = await this._getById(assignmentId, classroomId);

        return !!assignment ? assignment.populate(['createdBy', 'students.studentId']) : null;
    }

    // Come CartItemService.update: recupero il documento, lo modifico e faccio save().
    // Torna null (come update nel riferimento) se classe/attività inesistenti o non collegate,
    // oppure se lo studente non è nella lista: sarà il controller a lanciare NotFoundError.
    // AssignmentAlreadyCompletedError invece resta nel service (come UserExistsError in user.service):
    // è il controller che decide cosa tornare al client (yaml 400).
    async complete(classroomId: string, assignmentId: string, studentId: string): Promise<AssignmentDocument | null> {
        const assignment = await this._getById(assignmentId, classroomId);
        if (!assignment) {
            return null;
        }

        const student = assignment.students.find(s => s.studentId.toString() === studentId);
        if (!student) {
            return null;
        }

        if (student.completed) {
            throw new AssignmentAlreadyCompletedError();
        }

        student.completed = true;
        student.completedAt = new Date();
        const updated = await assignment.save();

        return updated.populate('createdBy');
    }
}

export default new AssignmentService();