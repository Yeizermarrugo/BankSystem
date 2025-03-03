import { v4 as uuidv4 } from "uuid";
import AccountModel from "../../domain/model/accounts.model";

/**
 * Get all accounts
 * @returns Promise<AccountModel[]>
 */
export const getAllAccounts = async (): Promise<AccountModel[]> => {
	return await AccountModel.findAll();
};

/**
 * Get an account by ID
 * @param id - Account ID
 * @param includeInactive - If true, includes inactive accounts
 * @returns Promise<AccountModel | null>
 */
export const getAccountById = async (id: string, includeInactive = false): Promise<AccountModel | null> => {
	return await AccountModel.findOne({
		where: { id, ...(includeInactive ? {} : { isActive: true }) }
	});
};

/**
 * Create a new account
 * @param data - Account data
 * @returns Promise<AccountModel>
 */
export const createAccount = async (data: Partial<AccountModel>, userId: string): Promise<AccountModel> => {
	if (!data.nombre) {
		throw new Error("Todos los campos son obligatorios");
	}
	const newAccount = await AccountModel.create({
		id: uuidv4(),
		userId: userId,
		nombre: data.nombre,
		saldo: data.saldo,
		moneda: data.moneda || "USD",
		isActive: true
	});
	return newAccount;
};

/**
 * Edit an existing account
 * @param accountId - Account ID
 * @param data - Updated account data
 * @returns Promise<AccountModel | null>
 */
export const editAccount = async (accountId: string, data: Partial<AccountModel>): Promise<AccountModel | null> => {
	const account = await getAccountById(accountId);
	if (!account) {
		throw new Error("Account not found");
	}

	await AccountModel.update(data, { where: { id: accountId } });
	return await AccountModel.findByPk(accountId);
};

/**
 * Soft delete an account by ID
 * @param id - Account ID
 * @returns Promise<boolean> - Returns true if the account was marked as inactive
 */
export const deleteAccount = async (id: string): Promise<boolean> => {
	const account = await getAccountById(id);
	if (!account) {
		throw new Error("Account not found");
	}

	await AccountModel.update({ isActive: false }, { where: { id } });
	return true;
};

/**
 * Restore an account by ID
 * @param id - Account ID
 * @returns Promise<boolean> - Returns true if the account was marked as inactive
 */
export const restoreAccount = async (id: string): Promise<boolean> => {
	const account = await getAccountById(id, true);
	if (!account) {
		throw new Error("Account not found");
	}

	await AccountModel.update({ isActive: true }, { where: { id } });
	return true;
};
