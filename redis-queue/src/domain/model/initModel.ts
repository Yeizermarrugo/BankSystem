import Notification from "./notification";

const initModel = () => {
	Notification.sync()
		.then(() => console.log("Notifications model synced successfully"))
		.catch((err) => console.error("Error syncing Notifications model:", err));
};

export default initModel;
