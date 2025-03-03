import { DataTypes, Model, Optional } from "sequelize";
import db from "../utils/database";
import Account from "./accounts.model";

interface TransactionAttributes {
	id: string;
	accountId: string;
	tipo: "ingreso" | "egreso";
	categoria: "retiro_cajero" | "retiro_banco" | "pago" | "transferencia_envio" | "deposito_cajero" | "deposito_banco" | "transferencia_recibida";
	monto: number;
	descripcion: string;
	createdAt: Date;
	updatedAt: Date;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id" | "createdAt" | "updatedAt"> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
	public id!: string;
	public accountId!: string;
	public tipo!: "ingreso" | "egreso";
	public categoria!: "retiro_cajero" | "retiro_banco" | "pago" | "transferencia_envio" | "deposito_cajero" | "deposito_banco" | "transferencia_recibida";
	public monto!: number;
	public descripcion!: string;
	public createdAt!: Date;
	public updatedAt!: Date;
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
				model: Account,
				key: "id"
			}
		},
		tipo: {
			type: DataTypes.ENUM("ingreso", "egreso"),
			allowNull: false
		},
		categoria: {
			type: DataTypes.ENUM("retiro_cajero", "retiro_banco", "pago", "transferencia_envio", "deposito_cajero", "deposito_banco", "transferencia_recibida"),
			allowNull: false
		},
		monto: {
			type: DataTypes.DECIMAL(15, 2),
			allowNull: false,
			validate: {
				min: 0.01 // No se permiten valores negativos
			}
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: "createdAt"
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: "updatedAt"
		}
	},
	{
		sequelize: db,
		tableName: "transactions",
		timestamps: false
	}
);

export default Transaction;
