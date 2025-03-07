import { v4 as uuidv4 } from "uuid";
import AccountModel from "../../domain/model/accounts.model";

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
const generateAccountNumber = async (): Promise<string> => {
	let accountNumber;
	let exists;

	do {
		accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
		exists = await AccountModel.findOne({ where: { accountNumber } });
	} while (exists);

	return accountNumber;
};

/**
 * Create a new account
 * @param data - Account data
 * @param userId - User ID
 * @returns Promise<AccountModel>
 */
export const createAccount = async (data: Partial<AccountModel>, userId: string): Promise<AccountModel> => {
	if (!data.nombre) {
		throw new Error("Todos los campos son obligatorios");
	}

	const accountNumber = await generateAccountNumber();

	const newAccount = await AccountModel.create({
		id: uuidv4(),
		userId: userId,
		nombre: data.nombre,
		accountNumber,
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
export const editAccount = async (id: string, userId: string, data: Partial<AccountModel>): Promise<AccountModel | null> => {
	const account = await getAccountById(id, userId);
	if (!account) {
		throw new Error("Account not found");
	}
	const { saldo, moneda, ...accountModified } = data;

	await AccountModel.update(accountModified, { where: { id, userId } });
	return await AccountModel.findByPk(id);
};

/**
 * Soft delete an account by ID
 * @param id - Account ID
 * @returns Promise<boolean> - Returns true if the account was marked as inactive
 */
export const deleteAccount = async (id: string, userId: string): Promise<boolean> => {
	const account = await getAccountById(id, userId);
	if (!account) {
		throw new Error("Account not found");
	}

	await AccountModel.update({ isActive: false }, { where: { id } });
	return true;
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
