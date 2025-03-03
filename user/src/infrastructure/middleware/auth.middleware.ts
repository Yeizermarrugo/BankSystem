import passport from "passport";
import { ExtractJwt, Strategy, StrategyOptions, VerifiedCallback } from "passport-jwt";
import { getUserById } from "../../application/user/user.service";
import { configs } from "../../config/config";

// Definimos la configuración de Passport
const passportConfigs: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: configs.api.secretOrKey as string
};

// Creamos la estrategia JWT
passport.use(
	new Strategy(passportConfigs, async (tokenDecoded: { id: string }, done: VerifiedCallback) => {
		try {
			const user = await getUserById(tokenDecoded.id);
			if (user) {
				return done(null, tokenDecoded); // Usuario válido
			} else {
				return done(null, false, { message: "Token Incorrect" }); // Usuario no encontrado
			}
		} catch (err) {
			return done(err, false); // Error en la base de datos
		}
	})
);

export default passport.authenticate("jwt", { session: false });
