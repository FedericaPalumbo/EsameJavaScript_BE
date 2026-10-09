//errore che capita solo in fase di Completamento di un'attività
//(PATCH /classrooms/{classroomId}/assignments/{id}) quando lo studente
//l'ha già completata: lo yaml prevede 400.
//Come UserExistsError non ha un middleware che lo gestisce: lo lancio dal servizio
//(che NON puo funzionare se l'utente ha già completato l'attività)
//quindi è compito del controller catturarlo e capire cosa tornare al client (400).
export class AssignmentAlreadyCompletedError extends Error {
    constructor() {
        super();
        this.name = 'AssignmentAlreadyCompleted';
        this.message = 'assignment already completed by the user';
    }
}
