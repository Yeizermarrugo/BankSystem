import { compareSync, hashSync } from "bcrypt";

/**
 * Hash a plain text password using bcrypt
 * @param plainPassword - The password to hash
 * @returns A hashed password string
 */
export const hashPassword = (plainPassword: string): string => {
	return hashSync(plainPassword, 10);
};

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword - The plain text password
 * @param hashedPassword - The hashed password
 * @returns A boolean indicating whether the passwords match
 */
export const comparePassword = (plainPassword: string, hashedPassword: string): boolean => {
	return compareSync(plainPassword, hashedPassword);
};
