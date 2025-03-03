import User from "./user.model";

const initModel = () => {
	User.sync()
		.then(() => console.log("User model synced successfully"))
		.catch((err) => console.error("Error syncing User model:", err));
};

export default initModel;
