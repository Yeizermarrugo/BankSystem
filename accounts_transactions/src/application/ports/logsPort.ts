interface LogsPort {
	sendLog(service: string, entityId: string, action: string, status: string, message: any, oldData?: any, newData?: any): Promise<void>;
}

export { LogsPort };
