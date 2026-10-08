//jwt-strategy.ts: estrae il token dall’header Authorization: Bearer,
// usa payload.id per ritrovare l’utente con UserModel.findById e lo
// mette in req.user come plain object.


//Copia e incolla dall'esempio in classe
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { UserModel } from "../../../api/user/user.model";

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'my_jwt_secret'
},
    async (payload, done) => {
        try {
            const user = await UserModel.findById(payload.id);
            if (user) {
                done(null, user.toObject());
            } else {
                done(null, false, { message: 'invalid token' });
            }
        } catch (err) {
            done(err);
        }
    })
)