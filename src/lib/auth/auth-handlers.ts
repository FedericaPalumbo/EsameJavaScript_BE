//auth-handlers.ts: importa le due strategie e dichiara Express.User
// estendendo il User, quindi req.user ha id, role e gli altri campi tipizzati.
// È già importato in app.ts, quindi non serve toccare altro.

//Copia e incolla dall'esempio in classe
import { User as AppUser } from "../../api/user/user.entity";
import './local/local-strategy';
import './jwt/jwt-strategy';

declare global {
    namespace Express {
        interface User extends AppUser {

        }
    }
}