import Logs from "./log.model";

const initModel = () => {
	Logs.sync()
		.then(() => console.log("Logs model synced successfully"))
		.catch((err) => console.error("Error syncing Logs model:", err));
};

export default initModel;
