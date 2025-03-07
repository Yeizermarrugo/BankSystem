import { Sequelize } from "sequelize";
import { configs } from "../../config/config";

const db = new Sequelize(configs.db[configs.api.nodeEnv as keyof typeof configs.db]);

export default db;
