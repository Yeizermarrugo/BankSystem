import redis from "../../config/redisConfig";

export const sendMessageToQueue = async (message: string) => {
	await redis.lpush("notificationQueue", message);
	console.log(`📩 Mensaje enviado: ${message}`);
};

export const receiveMessageFromQueue = async () => {
	return await redis.rpop("notificationQueue");
};
