
import sequelize from "./database.js";

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const synchronize = async() =>{
  await sequelize.sync({ force: false });
  console.log("model synced")
}

synchronize()

dbConnect()

// import "./models/index.js"

export {dbConnect}
