import { Request, Response } from "express";
import { hashPassword } from "../../domain/utils/crypt";
import * as responses from "../../domain/utils/handleResponses";
import { LogsAdapter } from "../../infrastructure/adapters/logsAdapter";
import { NotificationAdapter } from "../../infrastructure/adapters/notificationAdapter";
import { deleteUser, editUser, getAllUsers, getUserById, softDelete } from "./user.service";
const notificationService = new NotificationAdapter();
const logsService = new LogsAdapter();

export const getAll = (req: Request, res: Response) => {
	getAllUsers()
		.then((data) => {
			responses.success({
				status: 200,
				data: data,
				message: "Getting all Users",
				res
			});
		})
		.catch((err) => {
			responses.error({
				status: 400,
				data: err,
				message: "Something bad getting all users",
				res
			});
			console.log(err);
		});
};

export const getById = (req: Request, res: Response) => {
	const id = req.params.id;
	getUserById(id)
		.then((data) => {
			if (data) {
				responses.success({
					status: 200,
					data: [data],
					message: `Getting User with id: ${id}`,
					res
				});
			} else {
				responses.error({
					status: 404,
					message: `User with ID: ${id}, not found`,
					res
				});
			}
		})
		.catch((err) => {
			responses.error({
				status: 400,
				data: err,
				message: "Something bad getting the user",
				res
			});
		});
};

export const edit = (req: Request, res: Response) => {
	const id = req.params.id;
	const data = req.body;
	if (!Object.keys(data).length) {
		// si no existen los key, entro al error
		return res.status(400).json({ message: "Missing data" });
	} else if (!data.nombre || !data.apellido || !data.email || !data.telefono) {
		return res.status(400).json({
			message: "All fields must be completed",
			fields: {
				nombre: "string",
				apellido: "string",
				email: "example@example.com",
				telefono: "string"
			}
		});
	} else {
		const response = editUser(id, data, logsService, notificationService);
		return res.status(200).json({
			message: "User edited succesfully",
			user: data
		});
	}
};

export const remove = (req: Request, res: Response) => {
	const id = req.params.id;

	deleteUser(id)
		.then((data) => {
			if (data) {
				responses.success({
					status: 200,
					data: [data],
					message: `User with id: ${id} deleted successfully`,
					res
				});
			} else {
				responses.error({
					status: 404,
					data: [data],
					message: `The user with ID ${id} not found`,
					res
				});
			}
		})
		.catch((err) => {
			responses.error({
				status: 400,
				data: err,
				message: `Error ocurred trying to delete user with id ${id}`,
				res
			});
		});
};

//? los servicios para acciones sobre mi propio usuario:

export const getMyUserById = (req: Request, res: Response) => {
	if (!req.user) {
		throw new Error("User not authenticated");
	}
	const id = req.user.id;

	getUserById(id)
		.then((data) => {
			responses.success({
				res,
				status: 200,
				message: "This is your current user",
				data: [data]
			});
		})
		.catch((err) => {
			responses.error({
				res,
				status: 400,
				message: "Something bad getting the current user",
				data: err
			});
		});
};

export const deactivateMyUser = (req: Request, res: Response) => {
	if (!req.user) {
		throw new Error("User not authenticated");
	}
	const id = req.user.id;
	const data = softDelete(id);
	if (data) {
		return responses.success({
			res,
			status: 200,
			message: `User deactivated successfully with id: ${id}`,
			data: data
		});
	} else {
		return responses.error({
			res,
			status: 400,
			message: "Something bad trying to delete this user",
			data
		});
	}
};

export const editMyuser = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(401).json({ message: "User not authenticated" });
			return;
		}

		const userId = req.user.id;
		const { nombre, apellido, email, password, telefono, dni, address } = req.body;

		// Validar que al menos un campo esté presente
		if (!nombre && !apellido && !email && !password && !telefono && !password && !dni && !address) {
			res.status(400).json({
				message: "At least one field (nombre, apellido, email, password, telefono) is required"
			});
			return;
		}

		const data: any = {};
		if (nombre) data.nombre = nombre;
		if (apellido) data.apellido = apellido;
		if (email) data.email = email;
		if (password) data.password = hashPassword(password);
		if (telefono) data.telefono = telefono;
		if (dni) data.dni = dni;
		if (address) data.address = address;

		await editUser(userId, data, logsService, notificationService);

		res.status(200).json({
			message: "Your user has been updated successfully!",
			data
		});
	} catch (err) {
		res.status(500).json({
			message: "Something went wrong",
			error: err
		});
	}
};
