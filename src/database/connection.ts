import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";

const sequelize = new Sequelize({
  database: envConfig.databaseName, //name of db
  username: envConfig.databaseUserName, //db username --> default - root
  password: envConfig.databasePassword, //db password --> default - ""
  host: envConfig.databaseHost, //db location --> localhost for local datastorage
  dialect: "mysql", //which db used
  port: Number(envConfig.databasePort), //port number of used db
  models: [__dirname + "/models"], //current location + '/models'
});

//connection check
sequelize
  .authenticate()
  .then(() => {
    console.log("Authenticated, Connection");
  })
  .catch((error) => {
    console.log(error);
  });

//migration
sequelize.sync({ alter: false }).then(() => {
  console.log("Migration Successfull");
});

export default sequelize;
