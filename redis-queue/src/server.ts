import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { configs } from "./config/config";
import initModels from "./domain/model/initModel";
import db from "./domain/utils/database";
import { success } from "./domain/utils/handleResponses";

import { router as notificationRoute } from "./infrastructure/routes/notification.routes";

dotenv.config();
const app = express(); // Asegúrate de inicializar correctamente Express

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(
	cors({
		origin: "*",
		methods: "POST",
		allowedHeaders: ["Content-Type"]
	})
);

db.authenticate()
	.then(async () => {
		console.log("Database Authenticated");
	})
	.catch((err) => console.log(err));

db.sync()
	.then(() => console.log("Database synced"))
	.catch((err) => console.log(err));

initModels();
app.get("/", (req, res) => {
	success({
		res,
		status: 200,
		message: "Servidor inicializado correctamente",
		data: null
	});
});

app.use("/v1/send", notificationRoute);

// ⬇️ Asegúrate de que este código esté correctamente definido
app.listen(configs.api.port, () => {
	console.log(`🚀 Servidor corriendo en http://localhost:${configs.api.port}`);
});
