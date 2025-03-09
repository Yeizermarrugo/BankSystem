import { v4 as uuidv4 } from "uuid";
import AccountModel from "../../domain/model/accounts.model";
import { LogsPort } from "../ports/logsPort";
import { NotificationPort } from "../ports/notificationPort";

/**
 * Get all accounts
 * @returns Promise<AccountModel[]>
 */
export const getAllAccounts = async (userId: string): Promise<AccountModel[]> => {
	return await AccountModel.findAll({ where: { userId, isActive: true } });
};

/**
 * Get an account by ID
 * @param id - Account ID
 * @param userId - User ID (optional) to filter accounts by user
 * @param includeInactive - If true, includes inactive accounts
 * @returns Promise<AccountModel | null>
 */
export const getAccountById = async (id: string, userId?: string): Promise<AccountModel | null> => {
	const whereClause: any = { id };

	if (userId) {
		whereClause.userId = userId;
	}

	whereClause.isActive = true;
	return await AccountModel.findOne({
		where: whereClause,
		attributes: { exclude: ["userId"] }
	});
};

/**
 * Get an account ID by account number
 * @param accountNumber - Account number
 * @returns Promise<string | null>
 */
export const getAccountIdByAccountNumber = async (accountNumber: string): Promise<string | null> => {
	const account = await AccountModel.findOne({
		where: { accountNumber, isActive: true },
		attributes: ["id"]
	});

	return account ? account.id : null;
};

/**
 * Genera un número de cuenta de 10 dígitos aleatorio.
 * @returns string
 */
const generateAccountNumber = async (logsService: LogsPort): Promise<string> => {
	let accountNumber;
	let exists;
	let attempts = 0;

	try {
		do {
			accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
			exists = await AccountModel.findOne({ where: { accountNumber } });

			if (exists) {
				await logsService.sendLog("accounts", "system", "generate_account_number", "warning", `Collision detected: ${accountNumber} already exists (Attempt #${attempts})`);
			}
		} while (exists);

		await logsService.sendLog("accounts", "system", "generate_account_number", "success", `Account number generated successfully: ${accountNumber} (Attempts: ${attempts})`);

		return accountNumber;
	} catch (err: any) {
		await logsService.sendLog("accounts", "system", "generate_account_number", "error", `Failed to generate account number: ${err.message}`);
		throw new Error("Error generating account number");
	}
};

/**
 * Create a new account
 * @param data - Account data
 * @param userId - User ID
 * @returns Promise<AccountModel>
 */
export const createAccount = async (data: Partial<AccountModel>, userId: string, logsService: LogsPort, notificationService: NotificationPort): Promise<AccountModel> => {
	if (!data.nombre) {
		throw new Error("Todos los campos son obligatorios");
	}

	try {
		const accountNumber = await generateAccountNumber(logsService);

		const newAccount = await AccountModel.create({
			id: uuidv4(),
			userId: userId,
			nombre: data.nombre,
			accountNumber,
			saldo: data.saldo,
			moneda: data.moneda || "USD",
			isActive: true
		});

		await logsService.sendLog("accounts", newAccount.id, "create", "success", `Account created successfully for user ${userId} with account number ${accountNumber}`);
		await notificationService.sendMessageToQueue(`🎉 ¡Cuenta creada con éxito! Tu número de cuenta es: ${accountNumber}.`);
		return newAccount;
	} catch (err: any) {
		await logsService.sendLog("accounts", userId, "create", "error", `Failed to create account: ${err.message}`);

		console.error("Error creating account:", err);
		throw new Error("Failed to create account");
	}
};

/**
 * Edit an existing account
 * @param accountId - Account ID
 * @param data - Updated account data
 * @returns Promise<AccountModel | null>
 */
export const editAccount = async (id: string, userId: string, data: Partial<AccountModel>, logsService: LogsPort, notificationService: NotificationPort): Promise<AccountModel | null> => {
	const account = await getAccountById(id, userId);
	if (!account) {
		throw new Error("Account not found");
	}
	try {
		const oldData = { ...account.dataValues };
		console.log("old data", oldData);
		const { accountNumber, saldo, moneda, ...accountModified } = data;

		await AccountModel.update(accountModified, { where: { id, userId } });
		const updatedAccount = await AccountModel.findByPk(id);
		const newData = { ...updatedAccount?.dataValues };
		await logsService.sendLog("accounts", id, "edit", "success", `Account updated successfully for user ${userId}`, oldData, newData);
		await notificationService.sendMessageToQueue(`🎉 ¡Cuenta actualizada con éxito!`);
		return updatedAccount;
	} catch (err: any) {
		await logsService.sendLog("accounts", id, "update", "error", `Failed to update account: ${err.message}`);
		console.error("Error updating account:", err);
		throw new Error("Failed to update account");
	}
};

/**
 * Soft delete an account by ID
 * @param id - Account ID
 * @returns Promise<boolean> - Returns true if the account was marked as inactive
 */
export const deleteAccount = async (id: string, userId: string, logsService: LogsPort, notificationService: NotificationPort): Promise<boolean> => {
	const account = await getAccountById(id, userId);
	if (!account) {
		throw new Error("Account not found");
	}
	try {
		// Guardar estado anterior para logs
		const oldData = { ...account.dataValues };

		// Desactivar cuenta (soft delete)
		await AccountModel.update({ isActive: false }, { where: { id } });

		// 🔹 Log de éxito
		await logsService.sendLog("accounts", id, "delete", "success", `Account deactivated: ${JSON.stringify(oldData)}`);

		// 🔹 Notificación al usuario
		await notificationService.sendMessageToQueue(`⚠️ Tu cuenta (${id}) ha sido desactivada. Si necesitas reactivarla, contacta soporte.`);

		return true;
	} catch (error: any) {
		// 🔹 Log de error
		await logsService.sendLog("accounts", id, "delete", "error", `Failed to delete account: ${error.message}`);
		console.error("Error deleting account:", error);
		throw new Error("Failed to delete account");
	}
};

// /**
//  * Restore an account by ID
//  * @param id - Account ID
//  * @returns Promise<boolean> - Returns true if the account was marked as inactive
//  */
// export const restoreAccount = async (id: string): Promise<boolean> => {
// 	const account = await getAccountById(id);
// 	if (!account) {
// 		throw new Error("Account not found");
// 	}

// 	await AccountModel.update({ isActive: true }, { where: { id } });
// 	return true;
// };
