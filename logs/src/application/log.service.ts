import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Logs from "../domain/model/log.model";

/**
 * Get all logs
 * @returns Promise<Logs[]>
 */
export const getAllLogs = async (): Promise<Logs[]> => {
	const data = await Logs.findAll();
	return data;
};

/**
 * Get logs by service
 * @param service - user, account, transaction, notification...
 * @returns Promise<Logs[]>
 */
export const getLogsByService = async (service: string): Promise<Logs[]> => {
	const data = await Logs.findAll({
		where: { service }
	});
	return data;
};

/**
 * Get logs by service
 * @param action - create, update, delete...
 * @returns Promise<Logs[]>
 */
export const getLogsByAction = async (action: string): Promise<Logs[]> => {
	const data = await Logs.findAll({
		where: { action: { [Op.like]: action } }
	});
	return data;
};

/**
 * Get logs by date range
 * @param startDate - Start date in ISO format (YYYY-MM-DD)
 * @param endDate - End date in ISO format (YYYY-MM-DD)
 * @return Returns a Promise<Logs[] | null>
 * @throws Error if date range is not valid or missing
 */
export const getLogsByDateRange = async (startDate: string, endDate: string): Promise<Logs[] | null> => {
	try {
		// Validar que ambas fechas estén presentes
		if (!startDate || !endDate) {
			throw new Error("Invalid date range. Please provide both start and end dates.");
		}

		// Convertir a objeto Date y validar
		const start = new Date(`${startDate}T00:00:00.000-05:00`);
		const end = new Date(`${endDate}T23:59:59.999-05:00`);
		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			throw new Error("Invalid date format. Please provide dates in ISO format (YYYY-MM-DD).");
		}

		// Ajustar la fecha final para incluir todo el día (23:59:59)
		end.setHours(23, 59, 59, 999);

		const data = await Logs.findAll({
			where: {
				createdAt: {
					[Op.gte]: start,
					[Op.lte]: end
				}
			}
		});

		return data;
	} catch (error) {
		console.error("Error fetching logs by date range:", error);
		throw new Error("Failed to fetch logs. Please try again.");
	}
};

/**
 * Get last 7 days logs
 * @returns promise<Logs[] | null>
 */
export const getRecentLogs = async () => {
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const data = await Logs.findAll({
		where: {
			createdAt: {
				[Op.gte]: sevenDaysAgo // createdAt >= hace 7 días
			}
		}
	});

	return data;
};

/**
 * Create a new log
 * @param data - Log data
 * @returns promise<Log>
 */
export const createLog = async (data: Partial<Logs>) => {
	if (!data.service || !data.entityId || !data.action || !data.status || !data.message) {
		throw new Error("Missing required fields");
	}
	const newLog = await Logs.create({
		id: uuidv4(),
		service: data.service,
		entityId: data.entityId,
		action: data.action,
		status: data.status,
		message: data.message,
		oldData: typeof data.oldData === "string" ? JSON.parse(data.oldData) : data.oldData,
		newData: typeof data.newData === "string" ? JSON.parse(data.newData) : data.newData
	});

	return newLog;
};
