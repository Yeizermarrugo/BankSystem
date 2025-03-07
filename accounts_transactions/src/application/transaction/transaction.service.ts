import { v4 as uuidv4 } from "uuid";
import AccountModel from "../../domain/model/accounts.model";
import TransactionModel from "../../domain/model/transactions.model";
import { getAccountById } from "../account/account.service";

/**
 * Get all transactions by account ID
 * @param accountId - Account ID
 * @returns Promise<TransactionModel[]>
 */
export const getTransactionByAccount = async (accountId: string, userId: string): Promise<TransactionModel[] | null> => {
	const account = await getAccountById(accountId, userId);
	if (!account) return null;
	return await TransactionModel.findAll({
		where: {
			accountId
		},
		include: [
			{
				model: AccountModel,
				where: { userId }
			}
		]
	});
};

/**
 * Create a new transactions by account ID
 * @param accountId - Account ID
 * @param data - Transaction data
 * @returns Promise<TransactionModel[]>
 */
export const createTransactionByAccount = async (accountId: string, data: TransactionModel, userId: string): Promise<TransactionModel> => {
	// 1. Validar que la cuenta origen exista y pertenezca al usuario
	const account = await getAccountById(accountId, userId);
	if (!account) {
		throw new Error("Cuenta no válida o no perteneces a este usuario");
	}

	// 2. Validar monto mínimo
	if (data.monto <= 999) {
		throw new Error("El monto debe ser mayor a $999.99");
	}

	// 3. Validar saldo suficiente si es un egreso
	if (data.tipo === "egreso" && data.monto > account.saldo) {
		throw new Error("Saldo insuficiente");
	}

	// 4. Validar transferencia
	if (data.categoria === "transferencia_envio") {
		if (!data.destinoAccountId) {
			throw new Error("Debe proporcionar una cuenta destino para la transferencia");
		}

		// Validar que la cuenta destino existe
		const destinoAccount = await getAccountById(data.destinoAccountId);
		if (!destinoAccount) {
			throw new Error("Cuenta destino no válida");
		}

		// No permitir transferencias a la misma cuenta
		if (accountId === data.destinoAccountId) {
			throw new Error("No puedes transferir a la misma cuenta");
		}
	}

	if (data.categoria === "transferencia_recibida") {
		throw new Error("Esta accion no esta permitida");
	}

	// 5. Crear la transacción
	const newTransaction = await TransactionModel.create({
		id: uuidv4(),
		accountId,
		destinoAccountId: data.destinoAccountId,
		tipo: data.tipo,
		categoria: data.categoria,
		monto: data.monto,
		descripcion: data.descripcion
	});

	// 6. Si es una transferencia, registrar el ingreso en la cuenta destino
	if (data.categoria === "transferencia_envio" && data.destinoAccountId && data.tipo === "egreso") {
		await TransactionModel.create({
			id: uuidv4(),
			accountId: data.destinoAccountId,
			destinoAccountId: accountId,
			tipo: "ingreso",
			categoria: "transferencia_recibida",
			monto: data.monto,
			descripcion: `Transferencia recibida desde cuenta ${account.accountNumber}`
		});
	}

	return newTransaction;
};
