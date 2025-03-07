import axios from "axios";
import { NotificationPort } from "../../application/ports/notificationPort";

export class NotificationAdapter implements NotificationPort {
	async sendMessageToQueue(message: string): Promise<void> {
		console.log("object send notification", message);
		try {
			await axios.post("http://localhost:3002/v1/send", { message });
			console.log("✅ Notificación enviada:", message);
		} catch (error: any) {
			console.error("❌ Error enviando notificación:", error.message);
		}
	}
}
