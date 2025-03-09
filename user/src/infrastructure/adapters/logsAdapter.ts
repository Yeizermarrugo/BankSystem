import axios from "axios";
import { LogsPort } from "../../application/ports/logsPort";

export class LogsAdapter implements LogsPort {
	async sendLog(service: string, entityId: string, action: string, status: string, message: string, oldData?: any, newData?: any): Promise<void> {
		try {
			await axios.post("http://localhost:9000/v1/logs", { service, entityId, action, status, message, oldData, newData });
			console.log("✅ Logs creado con exito:", { service, entityId, action, status, message });
		} catch (error: any) {
			console.error("❌ Error creando Logs:", error.message);
		}
	}
}
