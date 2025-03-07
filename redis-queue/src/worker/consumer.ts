import { v4 as uuidv4 } from "uuid";
import redis from "../config/redisConfig";
import Notification from "../domain/model/notification";

export const processQueue = async () => {
	while (true) {
		const message = await redis.rpop("notificationQueue");

		if (message) {
			console.log("📨 Notificación recibida de Redis:", message);

			try {
				// Guardar en la base de datos
				const notification = await Notification.create({
					id: uuidv4(),
					message,
					status: "sent"
				});

				console.log("✅ Notificación guardada en la BD:", notification.toJSON());
			} catch (error) {
				console.error("❌ Error guardando en la BD:", error);

				// Opcional: Guardar como fallo
				await Notification.create({
					id: uuidv4(),
					message,
					status: "failed"
				});
			}
		} else {
			console.log("📭 No hay mensajes en la cola, esperando...");
			await new Promise((resolve) => setTimeout(resolve, 20000));
		}
	}
};

// Ejecutar el consumer
processQueue();
