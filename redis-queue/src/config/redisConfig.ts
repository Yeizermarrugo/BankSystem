import dotenv from "dotenv";
import Redis from "ioredis";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT)
});

redis.on("connect", () => console.log("✅ Conectado a Redis"));
redis.on("error", (err) => console.error("❌ Error en Redis:", err));

export default redis;
