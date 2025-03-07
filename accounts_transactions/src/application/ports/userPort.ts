interface UserPort {
	getUserById(id: string, token: string): Promise<any>;
}

export { UserPort };
