import { DataTypes, Model, Optional } from "sequelize";
import db from "../utils/database";
import Account from "./accounts.model";

interface TransactionAttributes {
	id: string;
	accountId: string;
	destinoAccountId?: string;
	tipo: "ingreso" | "egreso";
	categoria: "retiro_cajero" | "retiro_banco" | "pago" | "transferencia_envio" | "deposito_cajero" | "deposito_banco" | "transferencia_recibida";
	monto: number;
	descripcion: string;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id"> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
	public id!: string;
	public accountId!: string;
	public destinoAccountId?: string;
	public tipo!: "ingreso" | "egreso";
	public categoria!: "retiro_cajero" | "retiro_banco" | "pago" | "transferencia_envio" | "deposito_cajero" | "deposito_banco" | "transferencia_recibida";
	public monto!: number;
	public descripcion!: string;
}

Transaction.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		accountId: {
			type: DataTypes.UUID,
			allowNull: false,
			field: "accountId",
			references: {
				model: Account
			}
		},
		destinoAccountId: {
			type: DataTypes.UUID,
			allowNull: true,
			field: "destinoaccountId",
			references: {
				model: Account
			}
		},
		tipo: {
			type: DataTypes.ENUM("ingreso", "egreso"),
			allowNull: false,
			validate: {
				isValidTipo(this: Transaction, value: string) {
					const egresoCategories = ["retiro_cajero", "retiro_banco", "pago", "transferencia_envio"];

					// Aseguramos que `this` tenga el tipo adecuado
					const categoria = this.getDataValue("categoria") as string;

					if (categoria && egresoCategories.includes(categoria) && value !== "egreso") {
						throw new Error('El tipo debe ser "egreso" cuando la categoría es una de las siguientes: "retiro_cajero", "retiro_banco", "pago", "transferencia_envio"');
					}

					if (!egresoCategories.includes(categoria) && value !== "ingreso") {
						throw new Error('El tipo debe ser "ingreso" cuando la categoría no es una de las siguientes: "retiro_cajero", "retiro_banco", "pago", "transferencia_envio"');
					}
				}
			}
		},
		categoria: {
			type: DataTypes.ENUM("retiro_cajero", "retiro_banco", "pago", "transferencia_envio", "deposito_cajero", "deposito_banco", "transferencia_recibida"),
			allowNull: false
		},
		monto: {
			type: DataTypes.DECIMAL(15, 2),
			allowNull: false,
			validate: {
				min: 1000 // No se permiten valores negativos
			}
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	},
	{
		sequelize: db,
		tableName: "transactions",
		timestamps: false
	}
);

export default Transaction;
