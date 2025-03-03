import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import initModels from "./domain/model/initModels";
import { configs } from "../src/config/config";
import { success, error } from "./domain/utils/handleResponses";
//*archivos de rutas
// const authRoute = require("./auth/auth.routes").router;
import { router as authRoute } from "./infrastructure/routes/auth.routes";
import { router as userRoute } from "./infrastructure/routes/user.routes";
// const userRoute = require("./users/user.routes").router;
// const swaggerDoc = require("./swagger.json");

//* Conexion BD
import db from "./domain/utils/database";

//*configuracion inicial
const app = express();
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

db.authenticate()
	.then(() => console.log("Database Authenticated"))
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

app.use("/v1/auth", authRoute);
app.use("/v1/users", userRoute);
// app.use("/v1/doc", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("*", (req, res) => {
	error({
		res,
		status: 404,
		message: `URL not found, please try with ${configs.api.host}`
	});
});

app.listen(configs.api.port, () => {
	console.log(`Server started at port ${configs.api.port}`);
});

module.exports = app;
