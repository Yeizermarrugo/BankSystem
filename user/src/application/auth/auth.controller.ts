import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { configs } from "../../config/config";
import UserModel from "../../domain/model/user.model";
import * as responses from "../../domain/utils/handleResponses";
import { LogsAdapter } from "../../infrastructure/adapters/logsAdapter";
import { NotificationAdapter } from "../../infrastructure/adapters/notificationAdapter";
import { createUser } from "../user/user.service";
import { loginUser } from "./auth.service";

const notificationService = new NotificationAdapter();
const logsService = new LogsAdapter();

export const login = (req: Request, res: Response): void => {
	const { email, password } = req.body;
	loginUser(email, password, notificationService)
		.then((data) => {
			if (!configs.api.secretOrKey) {
				throw new Error("JWT secret key is missing");
			}
			if (data) {
				const token = jwt.sign(
					{
						id: data.id,
						email: data.email,
						password: data.password
					},
					configs.api.secretOrKey,
					{
						expiresIn: "1d"
					}
				);

				responses.success({
					res,
					status: 200,
					message: "Correct Credentials!",
					data: token
				});
			} else {
				responses.error({
					res,
					status: 401,
					message: "Invalid Credentials"
				});
			}
		})
		.catch((err) => {
			responses.error({
				res,
				status: 400,
				data: err,
				message: "Something Bad"
			});
		});
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
	try {
		const data = req.body;

		// Verificar si el usuario ya existe
		const user = await UserModel.findOne({ where: { email: data.email } });

		if (user) {
			return responses.error({
				res,
				status: 400,
				message: "Usuario ya existe"
			});
		}

		// Crear usuario
		const newUser = await createUser(data, notificationService, logsService);

		const { password, ...userWithoutPassword } = newUser.toJSON();

		return responses.success({
			status: 201,
			data: userWithoutPassword,
			message: `User created successfully with id: ${newUser.id}`,
			res
		});
	} catch (err) {
		return responses.error({
			status: 400,
			data: err,
			message: "Error occurred while creating a new user",
			res,
			fields: {
				nombre: "String",
				apellido: "String",
				email: "example@example.com",
				password: "String",
				telefono: "+52 1234 123 123",
				dni: "123456789",
				address: "String"
			}
		});
	}
};
