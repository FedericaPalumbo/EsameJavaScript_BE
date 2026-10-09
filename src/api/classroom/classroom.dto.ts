import { ArrayUnique, IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

// Rispecchia requestBodies/Classroom dello yaml: name e students sono entrambi required.
// Come CreateCartItemDto nel riferimento (productId: @IsMongoId), gli id sono validati
// come id Mongo: un id malformato dà 400 (come da yaml) invece di un errore di cast in mongoose.
export class CreateClassroomDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    // ArrayUnique evita doppioni, altrimenti studentsCount (students.length) sarebbe falsato
    @IsArray()
    @ArrayUnique()
    @IsMongoId({ each: true })
    students: string[];
}