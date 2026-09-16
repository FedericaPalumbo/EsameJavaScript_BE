export const USER_ROLES = ['student', 'teacher'] as const;
export type UserRole = typeof USER_ROLES[number];

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    picture: string;
    role: UserRole;
}