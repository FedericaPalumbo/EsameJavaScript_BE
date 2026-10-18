import { Classroom } from './classroom.entity';
import { ClassroomModel } from './classroom.model';

export class ClassroomService {

    // Come CartItemService.find(userId): filtro per utente e populate del campo con ref.
    // Qui il filtro è createdBy e si popola createdBy (nome del docente nella lista).
    async findByTeacher(teacherId: string): Promise<Classroom[]> {
        const classrooms = await ClassroomModel.find({ createdBy: teacherId }).populate('createdBy');
        return classrooms;
    }

    // Lo studente vede le classi di cui fa parte: mongoose, su un array di ref,
    // confronta il valore con ogni elemento dell'array (non serve $in).
    async findByStudent(studentId: string): Promise<Classroom[]> {
        const classrooms = await ClassroomModel.find({ students: studentId }).populate('createdBy');
        return classrooms;
    }

    // Come CartItem _getById(id, userId) nel riferimento: il controllo di accesso è un filtro della query,
    // findOne({ _id, user }) là, findOne({ _id, createdBy }) qui. Se la classe non esiste oppure non è di
    // questo docente torna null, sarà il controller a lanciare NotFoundError (yaml: 404).
    // NON popolo createdBy di proposito: chi la usa (es. assignment.controller) ha bisogno degli id
    // (students) per costruire l'attività, non dei dati del docente.
    async getByIdForTeacher(classroomId: string, teacherId: string): Promise<Classroom | null> {
        const classroom = await ClassroomModel.findOne({ _id: classroomId, createdBy: teacherId });
        return classroom ?? null;
    }

    // Come getByIdForTeacher, ma per lo studente: come in findByStudent, mongoose su un array di ref
    // confronta il valore con ogni elemento dell'array (non serve $in).
    async getByIdForStudent(classroomId: string, studentId: string): Promise<Classroom | null> {
        const classroom = await ClassroomModel.findOne({ _id: classroomId, students: studentId });
        return classroom ?? null;
    }

    // Come CartItemService.add(item, userId): aggiungo al dato in ingresso l'id dell'utente
    // che crea (qui createdBy, là user), creo e ritorno il documento popolato.
    async add(classroom: Omit<Classroom, 'id' | 'createdBy' | 'studentsCount'>, teacherId: string): Promise<Classroom> {
        const toAdd = {
            ...classroom,
            createdBy: teacherId
        }
        const newClassroom = await ClassroomModel.create(toAdd);
        return newClassroom.populate('createdBy');
    }
}

export default new ClassroomService();