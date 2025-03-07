import { DataTypes, Model, Optional } from "sequelize";
import db from "../utils/database";

interface AccountAttributes {
	id: string;
	userId: string;
	nombre: string;
	saldo: number;
	moneda: string;
	isActive: boolean;
	accountNumber: string;
	createdAt: Date;
	updatedAt: Date;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, "id" | "saldo" | "moneda" | "createdAt" | "updatedAt"> {}

class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
	public id!: string;
	public userId!: string;
	public nombre!: string;
	public accountNumber!: string;
	public saldo!: number;
	public moneda!: string;
	public isActive!: boolean;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Account.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			field: "userId"
		},
		nombre: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		accountNumber: {
			type: DataTypes.STRING(10),
			allowNull: false,
			unique: true
		},
		saldo: {
			type: DataTypes.DECIMAL(15, 2),
			allowNull: false,
			defaultValue: 0
		},
		moneda: {
			type: DataTypes.STRING(10),
			allowNull: false,
			defaultValue: "COP"
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
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
		tableName: "accounts",
		timestamps: true
	}
);

export default Account;
