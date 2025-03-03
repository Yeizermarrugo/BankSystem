import { Request, Response } from "express";
import * as responses from "../../domain/utils/handleResponses";
import { createAccount, deleteAccount, editAccount, getAccountById, getAllAccounts, restoreAccount } from "./account.service";

export const getAll = async (req: Request, res: Response) => {
	try {
		const accounts = await getAllAccounts();
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
		const id = req.params.id;
		const includeInactive = req.query.includeInactive === "true";
		const account = await getAccountById(id, includeInactive);

		if (account) {
			responses.success({
				status: 200,
				data: [account],
				message: `Getting account with id: ${id}`,
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
		const account = await createAccount(data, userId);
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
		const id = req.params.id;
		const updatedAccount = await editAccount(id, req.body);

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
		const id = req.params.id;
		const deleted = await deleteAccount(id);

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

export const restore = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const restored = await restoreAccount(id);

		if (restored) {
			responses.success({
				status: 200,
				message: `Account with id: ${id} restored successfully`,
				res,
				data: [restored]
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
			message: "Error restoring account",
			res
		});
	}
};
