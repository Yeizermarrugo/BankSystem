import { Request, Response } from "express";
import * as responses from "../../domain/utils/handleResponses";
import { LogsAdapter } from "../../infrastructure/adapters/logsAdapter";
import { NotificationAdapter } from "../../infrastructure/adapters/notificationAdapter";
import { createAccount, deleteAccount, editAccount, getAccountById, getAllAccounts } from "./account.service";

const logsService = new LogsAdapter();
const notificationService = new NotificationAdapter();

export const getAll = async (req: Request, res: Response) => {
	try {
		if (!req.userId) {
			throw new Error("User not authenticated");
		}
		const userId = req.userId;
		const accounts = await getAllAccounts(userId);
		responses.success({
			status: 200,
			data: accounts,
			message: "Getting all accounts",
			res
		});
	} catch (err) {
		responses.error({
			status: 400,
			data: err,
			message: "Something went wrong getting all accounts",
			res
		});
	}
};

export const getById = async (req: Request, res: Response) => {
	try {
		if (!req.userId) {
			throw new Error("User not authenticated");
		}
		const userId = req.userId;
		const id = req.params.id;
		if (!userId) {
			return responses.error({
				status: 401,
				data: null,
				message: "Unauthorized: No user ID found",
				res
			});
		}

		const account = await getAccountById(id, userId);

		if (account) {
			responses.success({
				status: 200,
				data: [account],
				message: `Getting account with id: ${account.id}`,
				res
			});
		} else {
			responses.error({
				status: 404,
				message: `Account not found`,
				res
			});
		}
	} catch (err) {
		responses.error({
			status: 400,
			data: err,
			message: "Something went wrong getting the account",
			res
		});
	}
};

export const create = async (req: Request, res: Response) => {
	try {
		if (!req.userId) {
			throw new Error("User not authenticated");
		}
		const userId = req.userId;
		if (!userId) {
			return responses.error({
				status: 401,
				data: null,
				message: "Unauthorized: No user ID found",
				res
			});
		}

		const data = req.body;
		const account = await createAccount(data, userId, logsService, notificationService);
		responses.success({
			status: 201,
			data: [account],
			message: "Account created successfully",
			res
		});
	} catch (err) {
		responses.error({
			status: 400,
			data: err,
			message: "Error creating account",
			res
		});
	}
};

export const edit = async (req: Request, res: Response) => {
	try {
		if (!req.userId) {
			throw new Error("User not authenticated");
		}
		const id = req.params.id;
		const userId = req.userId;
		const updatedAccount = await editAccount(id, userId, req.body, logsService, notificationService);

		if (updatedAccount) {
			responses.success({
				status: 200,
				data: [updatedAccount],
				message: `Account with id: ${id} updated successfully`,
				res
			});
		} else {
			responses.error({
				status: 404,
				message: `Account with ID: ${id} not found`,
				res
			});
		}
	} catch (err) {
		responses.error({
			status: 400,
			data: err,
			message: "Error updating account",
			res
		});
	}
};

export const remove = async (req: Request, res: Response) => {
	try {
		if (!req.userId) {
			throw new Error("User not authenticated");
		}
		const userId = req.userId;
		const id = req.params.id;
		const deleted = await deleteAccount(id, userId, logsService, notificationService);

		if (deleted) {
			responses.success({
				status: 200,
				message: `Account with id: ${id} deactivated successfully`,
				res,
				data: [deleted]
			});
		} else {
			responses.error({
				status: 404,
				message: `Account with ID: ${id} not found`,
				res
			});
		}
	} catch (err) {
		responses.error({
			status: 400,
			data: err,
			message: "Error deactivating account",
			res
		});
	}
};

// export const restore = async (req: Request, res: Response) => {
// 	try {
// 		const id = req.params.id;
// 		const restored = await restoreAccount(id);

// 		if (restored) {
// 			responses.success({
// 				status: 200,
// 				message: `Account with id: ${id} restored successfully`,
// 				res,
// 				data: [restored]
// 			});
// 		} else {
// 			responses.error({
// 				status: 404,
// 				message: `Account with ID: ${id} not found`,
// 				res
// 			});
// 		}
// 	} catch (err) {
// 		responses.error({
// 			status: 400,
// 			data: err,
// 			message: "Error restoring account",
// 			res
// 		});
// 	}
// };
