import { v4 as uuidv4 } from "uuid";
import UserModel from "../../domain/model/user.model";
import { hashPassword } from "../../domain/utils/crypt";

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
 * @returns Promise<User>
 */
export const createUser = async (data: Partial<UserModel>): Promise<UserModel> => {
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
	return newUser;
};

/**
 * Edit an existing user
 * @param userId - User ID
 * @param data - Updated user data
 * @returns Promise<UserModel | null> - Updated user or null if not found
 */
export const editUser = async (userId: string, data: Partial<UserModel>): Promise<UserModel | null> => {
	try {
		// Verificar si el usuario existe
		const user = await getUserById(userId);
		console.log("user: ", user);
		if (!user) {
			throw new Error("User not found");
		}

		// Eliminar la contraseña y ID del objeto a actualizar (seguridad)
		const { id, ...restOfProperties } = data;

		// Actualizar usuario
		await UserModel.update(restOfProperties, { where: { id: userId } });

		// Retornar el usuario actualizado
		return await UserModel.findByPk(userId);
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
		where: { email }
	});
};
