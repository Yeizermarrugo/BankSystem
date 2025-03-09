import { v4 as uuidv4 } from "uuid";
import UserModel from "../../domain/model/user.model";
import { hashPassword } from "../../domain/utils/crypt";
import { LogsPort } from "../ports/logsPort";
import { NotificationPort } from "../ports/notificationPort";

/**
 * Get all users excluding sensitive fields
 * @returns Promise<User[]>
 */
export const getAllUsers = async (): Promise<UserModel[]> => {
	const data = await UserModel.findAll({
		attributes: {
			exclude: ["password", "createdAt", "updatedAt"]
		},
		where: {
			isActive: true
		}
	});
	return data;
};

/**
 * Get a user by ID
 * @param id - User ID
 * @returns Promise<User | null>
 */
export const getUserById = async (id: string): Promise<UserModel | null> => {
	const data = await UserModel.findOne({
		where: { id, isActive: true },
		attributes: { exclude: ["password"] }
	});
	return data;
};

/**
 * Create a new user
 * @param data - User data
 * @param notificationService  - Notification service
 * @returns Promise<User>
 */
export const createUser = async (data: Partial<UserModel>, notificationService: NotificationPort, logsService: LogsPort): Promise<UserModel> => {
	if (!data.nombre || !data.apellido || !data.email || !data.password || !data.telefono || !data.dni || !data.address) {
		throw new Error("Todos los campos son obligatorios");
	}
	const newUser = await UserModel.create({
		id: uuidv4(),
		nombre: data.nombre,
		apellido: data.apellido,
		email: data.email,
		password: hashPassword(data.password as string),
		telefono: data.telefono,
		dni: data.dni,
		address: data.address,
		isActive: true
	});
	try {
		await notificationService.sendMessageToQueue(`🎉 ¡Bienvenido ${data.nombre} ${data.apellido}! Tu cuenta ha sido creada.`);
		await logsService.sendLog("users", newUser.id, "create", "success", `User created successfully ${newUser.id}`);
	} catch (error) {
		await logsService.sendLog("users", newUser.id, "create", "error", error);
		console.error("Error enviando notificación:", error);
	}
	return newUser;
};

/**
 * Edit an existing user
 * @param userId - User ID
 * @param data - Updated user data
 * @returns Promise<UserModel | null> - Updated user or null if not found
 */
export const editUser = async (userId: string, data: Partial<UserModel>, logsService: LogsPort, notificationService: NotificationPort): Promise<UserModel | null> => {
	try {
		// Verificar si el usuario existe
		const oldUser = await getUserById(userId);
		if (!oldUser) {
			await logsService.sendLog("users", userId, "update", "error", "User not found");
			throw new Error("User not found");
		}

		// Eliminar la contraseña y ID del objeto a actualizar (seguridad)
		const { id, ...restOfProperties } = data;

		await UserModel.update(restOfProperties, { where: { id: userId } });
		const newUser = await UserModel.findByPk(userId);
		const { password, ...oldData } = oldUser.dataValues;
		const { password: _, ...newData } = newUser?.dataValues || {};
		// Guardar Logs
		await logsService.sendLog("users", userId, "update", "success", "User updated successfully", oldData, newData);

		// Enviar notificación al usuario actualizado
		await notificationService.sendMessageToQueue(`🔄 Tu perfil ha sido actualizado correctamente ${newUser?.nombre} ${newUser?.apellido}`);

		// Retornar el usuario actualizado sin password
		return newUser;
	} catch (error) {
		console.error("Error updating user:", error);
		throw new Error("Failed to update user");
	}
};

/**
 * Delete a user by ID
 * @param id - User ID
 * @returns Promise<number> - Number of deleted records
 */
export const deleteUser = async (id: string): Promise<number> => {
	return await UserModel.destroy({ where: { id } });
};

/**
 * Soft delete a user by ID
 * @param id - User ID
 * @returns Promise<boolean> - True if deleted, False if not found
 */
export const softDelete = async (id: string): Promise<boolean> => {
	const [updatedRows] = await UserModel.update({ isActive: false }, { where: { id } });

	return updatedRows > 0;
};

/**
 * Get a user by email
 * @param email - User email
 * @returns Promise<User | null>
 */
export const getUserByEmail = async (email: string): Promise<UserModel | null> => {
	return await UserModel.findOne({
		where: { email, isActive: true }
	});
};
