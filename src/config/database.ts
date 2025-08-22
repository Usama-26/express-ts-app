import { Sequelize } from "sequelize";
import { ENV } from "./env";

const sequelize = new Sequelize({
  host: ENV.DB_HOST,
  dialect: "mysql",
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  logging: false,
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("✅ Database synced successfully");
  } catch (error) {
    console.error("❌ Failed to sync database:", error);
    process.exit(1);
  }
};

export default sequelize;
