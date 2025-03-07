import { Request, Response } from "express";
import { sendMessageToQueue } from "./notification.service";

export const sendMessage = async (req: Request, res: Response) => {
	try {
		const { message } = req.body;
		if (!message) {
			return res.status(400).json({ error: "Mensaje requerido" });
		}

		await sendMessageToQueue(message);
		return res.json({ success: true, message: "Mensaje enviado" });
	} catch (error) {
		console.error("❌ Error en sendMessage:", error);
		return res.status(500).json({ error: "Error interno del servidor" });
	}
};
