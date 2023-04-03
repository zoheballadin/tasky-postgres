import { Sequelize } from "sequelize";
import config from "config";



const sequelize = new Sequelize(
  config.get("DB_URI")
);

export default sequelize