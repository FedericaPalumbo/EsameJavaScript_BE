import { IsNotEmpty, IsString } from "class-validator";

// Rispecchia requestBodies/Assignment dello yaml: title è l'unico campo ed è required.
// Come CreateCartItemDto nel riferimento ci sono solo i campi che arrivano dal client nel body.
// Gli altri campi dell'attività NON stanno qui perché li aggiunge il codice:
// - classroom: arriva da req.params (validato con ClassroomIdParams di lib/id-params.ts)
// - createdBy: è l'utente loggato (req.user)
// - students: la lista viene copiata dalla classe al momento della creazione
export class CreateAssignmentDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}