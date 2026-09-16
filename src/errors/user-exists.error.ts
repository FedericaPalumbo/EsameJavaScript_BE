//errore che capita solo in fase di Registrazione
//quindi non ha senso che abbia un middleware che lo gestisce
//lo lancio dal servizio (quindi è compito del controller
// prendere questo e capire cosa tornare al client)

//se ho un middleware che gestisce un errore: ho anche un controller
//che capisce cosa tornare al client. (i servizi cercano di funzionare nel maggior numero di casi possibili)
// Ma in questo caso il servizio
// NON puo funzionare se appare questo errore.
export class UserExistsError extends Error {
    constructor() {
        super();
        this.name = 'UserExists';
        this.message = 'username already in use';
    }
}