import { comparePassword } from "../../domain/utils/crypt";
import { NotificationPort } from "../ports/notificationPort";
import { getUserByEmail } from "../user/user.service";

const formatDateTime = () => {
	const now = new Date();
	const fecha = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(now).replace(/ de /g, " ");
	const hora = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
	return { fecha, hora };
};

const loginUser = async (email: string, password: string, notificationService: NotificationPort) => {
	//? user.password = contraseña hasheada
	//* password = contraseña en texto plano
	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return false;
		}
		const verifyPassword = comparePassword(password, user.password);
		if (verifyPassword) {
			try {
				const { fecha, hora } = formatDateTime();
				const { nombre, apellido } = user;
				await notificationService.sendMessageToQueue(`🎉 ¡Bienvenido de nuevo! ${nombre} ${apellido}! Has ingresado exitosamente a su cuenta - ${fecha} Hora: ${hora}. 🎉`);
			} catch (error) {
				console.error("Error enviando notificación:", error);
			}
			return user;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};

export { loginUser };
