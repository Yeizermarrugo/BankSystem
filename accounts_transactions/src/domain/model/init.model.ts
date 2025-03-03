import Account from "./accounts.model";
import Transactions from "./transactions.model";

const initModel = () => {
	Transactions.belongsTo(Account, { foreignKey: "cuentaId", as: "cuenta" });
	Account.hasMany(Transactions, { foreignKey: "cuentaId", as: "movimientos" });
};

export default initModel;
