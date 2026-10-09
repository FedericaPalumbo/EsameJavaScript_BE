import { User } from "../user/user.entity";

// Come CartItem (product: string | Product):
// createdBy è string quando non è popolato (solo id) e User quando è popolato.
export interface Classroom {
    id: string;
    name: string;
    // nel DB salvo solo gli id degli studenti (ref: 'User'), non i dati duplicati
    students: string[];
    createdBy: string | User;
    // virtual: students.length. Non viene salvato nel DB
    studentsCount: number;
}