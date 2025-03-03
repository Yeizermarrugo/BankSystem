import { comparePassword } from "../../domain/utils/crypt";
import { getUserByEmail } from "../user/user.service";

const loginUser = async (email: string, password: string) => {
	//? user.password = contraseña hasheada
	//* password = contraseña en texto plano
	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return false;
		}
		const verifyPassword = comparePassword(password, user.password);
		if (verifyPassword) {
			return user;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};

export { loginUser };
