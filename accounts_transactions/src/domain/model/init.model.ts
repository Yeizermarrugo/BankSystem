import Account from "./accounts.model";
import Transactions from "./transactions.model";

const initModel = () => {
	Transactions.belongsTo(Account, { foreignKey: "accountId" });
	Account.hasMany(Transactions, { foreignKey: "accountId" });
};

export default initModel;
