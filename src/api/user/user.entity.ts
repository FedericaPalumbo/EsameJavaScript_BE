export const USER_ROLES = ['student', 'teacher'] as const;
export type UserRole = typeof USER_ROLES[number];

//Spiegazione 'UserRole'
//['student', 'teacher'] as const è un array di stringhe a sola lettura,
//e as const fa sì che TypeScript lo veda come 'student' | 'teacher' e non come string[].
// typeof USER_ROLES[number] significa “il tipo degli elementi dell’array”.
// A runtime esiste solo l’array, e nel DB viene salvata 
// a stringa 'student'. Se aggiungo un ruolo mi basta una stringa nell’array: il tipo,
// l’enum di mongoose e @IsIn si aggiornano da soli.

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    picture: string;
    role: UserRole;
}