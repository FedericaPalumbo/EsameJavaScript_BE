import { IsMongoId } from "class-validator";
//POST/GET /classrooms/{classroomId}/assigments → il param si chiama classroomId
//PATCH /classrooms/{classroomId}/assignments/{id} → servono entrambi classroomId e id  (Quindi devo dividere anche qui)
export class ClassroomIdParams {
    @IsMongoId()
    classroomId: string
}

export class AssignmentIdParams extends ClassroomIdParams {
    @IsMongoId()
    id: string
}