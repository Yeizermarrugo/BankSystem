import axios from "axios";
import { UserPort } from "../../application/ports/userPort";

export class UserAdapter implements UserPort {
	async getUserById(id: string, token: string): Promise<void> {
		try {
			const response = await axios.get(`http://localhost:7000/v1/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
			return response.data;
		} catch (error: any) {
			console.error("Error fetching user:", error.message);
			throw error;
		}
	}
}
