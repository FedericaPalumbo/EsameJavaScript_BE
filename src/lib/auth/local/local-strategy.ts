//cerca l'identitità per credentials.username,
// confronta la password con bcrypt.compare e restituisce l’utente (identity.toObject().user).
// Il populate('user') lo fa già il pre('findOne') del tuo user-identity.model.ts. 


//Copia e incolla dall'esempio in classe: tranne la gestione di segnalazione errori: per sicurezza non ho voluto
// specificare se l'utente ha sbagliato password o username quindi ho lanciato l'avviso generico

import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { UserIdentityModel } from "./user-identity.model";
import * as bcrypt from 'bcrypt';

passport.use('local', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    async function (username, password, done) {
        try {
            const identity = await UserIdentityModel.findOne({ 'credentials.username': username });
            // non trovo l'utente
            // lo yaml prevede un unico messaggio per POST /login ('Invalid username/password supplied'),
            // così non si rivela se a essere sbagliato è lo username o la password
            if (!identity) {
                return done(null, false, { message: 'Invalid username/password supplied' });
            }

            const match = await bcrypt.compare(password, identity.credentials.hashedPassword);
            if (!match) {
                return done(null, false, { message: 'Invalid username/password supplied' });
            }

            const user = identity.toObject().user;

            done(null, user);

        } catch (err) {
            done(err);
        }
    })
);