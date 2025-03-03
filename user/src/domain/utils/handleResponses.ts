import { Response } from "express";

interface SuccessResponse<T> {
	status: number;
	data: T | T[] | null;
	message: string;
	res: Response;
}

interface ErrorResponse {
	status: number;
	message: string;
	res: Response;
	data?: any;
	fields?: Record<string, string>;
}

//? Para respuestas exitosas
export const success = <T>({ status, data, message, res }: SuccessResponse<T>) => {
	const safeData = data || [];
	res.status(status).json({
		error: false,
		status,
		message,
		items: Array.isArray(data) ? data.length : 0,
		data: safeData
	});
};

//? Para respuestas de errores
export const error = ({ status, message, res, data, fields }: ErrorResponse) => {
	const response: Record<string, any> = {
		error: true,
		status,
		message
	};

	if (fields) response.fields = fields;
	if (data !== undefined) response.data = data; // Solo agregar `data` si existe

	res.status(status).json(response);
};
