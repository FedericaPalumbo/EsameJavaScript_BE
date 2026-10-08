export const USER_ROLES = ['student', 'teacher'] as const;
export type UserRole = typeof USER_ROLES[number];  //Come funziona esattamente USER_ROLES? è un numero quindi numero 1 studente numero 2 docente e via dicendo nel caso venissero aggiunti altri ruoli?

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    picture: string;
    role: UserRole;
}