import { DataTypes, Model } from "sequelize";
import db from "../utils/database";
class Notification extends Model {
	public id!: string;
	public message!: string;
	public status!: string;
}

Notification.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: "pending"
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
		modelName: "Notification",
		tableName: "notifications",
		timestamps: true
	}
);

export default Notification;
