import { DataTypes, Model, Optional } from "sequelize";
import db from "../utils/database";

// Definir los atributos del modelo
interface UserAttributes {
	id: string;
	nombre: string;
	apellido: string;
	email: string;
	password: string;
	telefono: string;
	dni: string;
	isActive: boolean;
	address: string;
	createdAt: Date;
	updatedAt: Date;
}

// Permitir atributos opcionales para `create()`
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "password" | "createdAt" | "updatedAt"> {}

// Definir el modelo extendiendo de `Model`
class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public id!: string;
	public nombre!: string;
	public apellido!: string;
	public email!: string;
	public password!: string;
	public telefono!: string;
	public dni!: string;
	public address!: string;
	public isActive!: boolean;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

// Inicializar el modelo en Sequelize
UserModel.init(
	{
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4
		},
		nombre: {
			allowNull: false,
			type: DataTypes.STRING
		},
		apellido: {
			allowNull: false,
			type: DataTypes.STRING
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING(30),
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			allowNull: false,
			type: DataTypes.STRING
		},
		telefono: {
			allowNull: false,
			type: DataTypes.STRING
		},
		dni: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true
		},
		address: {
			allowNull: true,
			type: DataTypes.STRING
		},
		isActive: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
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
		modelName: "User",
		tableName: "usuarios",
		timestamps: true
	}
);

export default UserModel;
