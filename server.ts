import app from "./src/app";
import { envConfig } from "./src/config/config";

//database connection import 
import "./src/database/connection"


function startServer() {
  const port = envConfig.portNumber;
  app.listen(port, () => {
    console.log("Project is listening at port " + port);
  });
}

startServer();
