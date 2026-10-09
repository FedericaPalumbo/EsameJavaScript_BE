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

    // Come ProductService.getById(id) nel riferimento: findById torna già null se non trova nulla.
    // NON popolo createdBy di proposito: chi la usa (es. AssignmentService) ha bisogno degli id
    // per i controlli (createdBy e students), non dei dati del docente.
    async getById(classroomId: string): Promise<Classroom | null> {
        const classroom = await ClassroomModel.findById(classroomId);
        return classroom;
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