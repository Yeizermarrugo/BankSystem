import { v4 as uuidv4 } from "uuid";
import AccountModel from "../../domain/model/accounts.model";
import TransactionModel from "../../domain/model/transactions.model";
import { getAccountById, getAccountIdByAccountNumber } from "../account/account.service";
import { NotificationPort } from "../ports/notificationPort";
import { UserPort } from "../ports/userPort";

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

const formatDateTime = () => {
	const now = new Date();
	const fecha = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(now).replace(/ de /g, " ");
	const hora = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
	return { fecha, hora };
};

/**
 * Create a new transactions by account ID
 * @param accountId - Account ID
 * @param data - Transaction data
 * @returns Promise<TransactionModel[]>
 */
export const createTransactionByAccount = async (accountId: string, data: TransactionModel & { accountNumber: string }, userId: string, token: string, notificationService: NotificationPort, userServise: UserPort): Promise<TransactionModel> => {
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
	let destinoAccountId;
	if (data.categoria === "transferencia_envio") {
		if (!data.accountNumber) {
			throw new Error("Debe proporcionar una cuenta destino para la transferencia");
		}

		// Validar que la cuenta destino existe
		destinoAccountId = await getAccountIdByAccountNumber(data.accountNumber);
		console.log("destinoAccountId: ", destinoAccountId);
		if (!destinoAccountId) {
			throw new Error("Cuenta destino no válida");
		}

		// No permitir transferencias a la misma cuenta
		if (accountId === data.accountNumber) {
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
		destinoAccountId,
		tipo: data.tipo,
		categoria: data.categoria,
		monto: data.monto,
		descripcion: data.descripcion
	});
	const user = await userServise.getUserById(userId, token);
	const userData = user.data[0];

	// 6. Si es una transferencia, registrar el ingreso en la cuenta destino
	if (data.categoria === "transferencia_envio" && destinoAccountId && data.tipo === "egreso") {
		await TransactionModel.create({
			id: uuidv4(),
			accountId: destinoAccountId,
			destinoAccountId: accountId,
			tipo: "ingreso",
			categoria: "transferencia_recibida",
			monto: data.monto,
			descripcion: data.descripcion ? data.descripcion : `Transferencia recibida de ${userData.nombre + " " + userData.apellido}`
		});
		try {
			const { fecha, hora } = formatDateTime();

			// Enviar notificación al destinatario de la transferencia (si es un egreso)
			await notificationService.sendMessageToQueue(`💸 Tranferencia realizada con exito a ${userData.nombre + " " + userData.apellido} - Dia ${fecha} Hora: ${hora}`);
		} catch (error) {
			console.error("Error enviando notificación:", error);
		}
	}

	return newTransaction;
};
