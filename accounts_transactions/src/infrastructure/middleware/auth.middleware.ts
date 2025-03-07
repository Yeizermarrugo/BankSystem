import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
	interface Request {
		userId?: string;
	}
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

		req.userId = decoded.id; // Guardamos solo el id
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
};
