//errore che capita solo in fase di Login
//a differenza di UserExistsError NON viene lanciato dal servizio: le credenziali
//le verifica la strategia 'local' di passport (local-strategy.ts), che se sono
//sbagliate non lancia nulla ma chiama done(null, false).
//Quindi lo istanzio nel controller (login), nella callback di passport.authenticate,
//quando user è false, ed è lì che decido cosa tornare al client:
//Come UserExistsError non ha un middleware che lo gestisce: la risposta la costruisce il controller.

export class WrongCredentialsError extends Error {
    constructor() {
        super();
        this.name = 'WrongCredentials';
        this.message = 'Invalid username/password supplied';
    }
}