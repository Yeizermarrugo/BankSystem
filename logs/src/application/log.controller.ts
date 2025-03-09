import { Request, Response } from "express";
import * as responses from "../domain/utils/handleResponses";
import { createLog, getAllLogs, getLogsByAction, getLogsByDateRange, getLogsByService, getRecentLogs } from "./log.service";

export const getAll = async (req: Request, res: Response) => {
	getAllLogs()
		.then((data) => {
			responses.success({
				status: 200,
				data: data,
				message: "Getting all logs",
				res
			});
		})
		.catch((error) => {
			responses.error({
				status: 400,
				data: error,
				message: "Error getting logs",
				res
			});
		});
};

export const getByService = async (req: Request, res: Response) => {
	const service = req.params.service;
	getLogsByService(service)
		.then((data) => {
			responses.success({
				status: 200,
				data: data,
				message: `Getting logs for service: ${service}`,
				res
			});
		})
		.catch((error) => {
			responses.error({
				status: 400,
				data: error,
				message: `Error getting logs for service: ${service}`,
				res
			});
		});
};

export const getByAction = async (req: Request, res: Response) => {
	const { action } = req.params;
	getLogsByAction(action)
		.then((data) => {
			responses.success({
				status: 200,
				data: data,
				message: `Getting logs for action: ${action}`,
				res
			});
		})
		.catch((error) => {
			responses.error({
				status: 400,
				data: error,
				message: `Error getting logs for action: ${action}`,
				res
			});
		});
};

getLogsByDateRange;

export const getByDateRange = async (req: Request, res: Response) => {
	const { startDate, endDate } = req.params;
	getLogsByDateRange(startDate, endDate)
		.then((data) => {
			responses.success({
				status: 200,
				data: data,
				message: `Getting logs between ${startDate} and ${endDate}`,
				res
			});
		})
		.catch((error) => {
			responses.error({
				status: 400,
				data: error,
				message: `Error getting logs between ${startDate} and ${endDate}`,
				res
			});
		});
};

export const getRecent = async (req: Request, res: Response) => {
	getRecentLogs()
		.then((data) => {
			responses.success({
				status: 200,
				data: data,
				message: "Getting recent logs",
				res
			});
		})
		.catch((error) => {
			responses.error({
				status: 400,
				data: error,
				message: "Error getting recent logs",
				res
			});
		});
};

export const create = async (req: Request, res: Response) => {
	try {
		const log = await createLog(req.body);
		responses.success({
			status: 201,
			data: [log],
			message: "Log created successfully",
			res
		});
	} catch (error) {
		responses.error({
			status: 400,
			data: error,
			message: "Error creating log",
			res
		});
	}
};
