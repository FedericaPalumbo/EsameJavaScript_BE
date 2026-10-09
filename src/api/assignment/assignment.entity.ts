import { Classroom } from "../classroom/classroom.entity";
import { User } from "../user/user.entity";

// Elemento dell'array students: tiene traccia di chi ha completato l'attività.
// Come CartItem (product: string | Product): studentId è string quando non è popolato
// (solo id) e User quando è popolato.
export interface AssignmentStudent {
    studentId: string | User;
    completed: boolean;
}

export interface Assignment {
    id: string;
    title: string;
    // ref: 'Classroom'. Non viene tornato nel JSON (la consegna non lo prevede)
    classroom: string | Classroom;
    createdBy: string | User;
    createdAt: Date;
    // nel DB salvo gli id degli studenti della classe + il flag completed.
    // Non viene tornato nel JSON: tornano solo i conteggi
    students: AssignmentStudent[];
    // virtual: students.length. Non viene salvato nel DB
    studentsCount: number;
    // virtual: numero di studenti con completed = true. Non viene salvato nel DB
    completedCount: number;
    // SOLO PER STUDENTI: non è nello schema, dipende dall'utente che chiama l'API.
    // Si aggiunge da codice (service/controller) dopo toObject()
    completed?: boolean;
}