import { DataTypes, Model } from "sequelize";
import db from "../utils/database";

class Logs extends Model {
	public id!: string;
	public service!: string;
	public entityId!: string;
	public action!: string;
	public status!: string;
	public message!: string;
	public oldData!: string;
	public newData!: string;
}

Logs.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		service: {
			type: DataTypes.STRING,
			allowNull: false
		},
		entityId: {
			type: DataTypes.UUID,
			allowNull: false,
			field: "entityId"
		},
		action: {
			type: DataTypes.STRING,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false
		},
		oldData: {
			type: DataTypes.JSONB,
			allowNull: true,
			field: "oldData"
		},
		newData: {
			type: DataTypes.JSONB,
			allowNull: true,
			field: "newData"
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
		modelName: "logs",
		tableName: "logs",
		timestamps: true
	}
);

export default Logs;
