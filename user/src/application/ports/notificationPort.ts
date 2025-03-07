interface NotificationPort {
	sendMessageToQueue(message: string): Promise<void>;
}

export { NotificationPort };
