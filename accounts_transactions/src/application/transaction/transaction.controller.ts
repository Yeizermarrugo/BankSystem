import { Request, Response } from "express";
import * as responses from "../../domain/utils/handleResponses";
import { createTransactionByAccount, getTransactionByAccount } from "./transaction.service";

export const getByAccount = async (req: Request, res: Response) => {
	try {
		if (!req.userId) {
			throw new Error("User not authenticated");
		}
		const userId = req.userId;
		const accountId = req.params.id;
		const transaction = await getTransactionByAccount(accountId, userId);

		if (transaction) {
			responses.success({
				status: 200,
				data: [transaction],
				message: `Getting all transaction`,
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

export const createTransaction = async (req: Request, res: Response) => {
	try {
		if (!req.userId) {
			throw new Error("User not authenticated");
		}
		const userId = req.userId;
		const accountId = req.params.id;
		const transaction = req.body;
		const newTransaction = await createTransactionByAccount(accountId, transaction, userId);

		responses.success({
			status: 201,
			data: [newTransaction],
			message: `Transaction created successfully for account with id: ${accountId}`,
			res
		});
	} catch (err: unknown) {
		// Comprobación del tipo de error
		if (err instanceof Error) {
			// Si es una instancia de Error, usa su mensaje
			responses.error({
				status: 400,
				message: err.message || "Something went wrong creating the transaction",
				res
			});
		} else {
			// Si no es una instancia de Error, puedes manejarlo como un error genérico
			responses.error({
				status: 400,
				data: err,
				message: "Something went wrong creating the transaction",
				res
			});
		}
	}
};
