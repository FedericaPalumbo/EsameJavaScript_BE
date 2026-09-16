//errore che capita solo in fase di Login
//stesso discorso di UserExistsError: il servizio non può "funzionare"
//se le credenziali sono sbagliate, quindi lo lancio dal servizio
//ed è il controller a decidere cosa tornare al client

export class WrongCredentialsError extends Error {
    constructor() {
        super();
        this.name = 'WrongCredentials';
        this.message = 'Invalid username/password supplied';
    }
}