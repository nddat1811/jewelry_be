// file ./config/database.ts
import { ConnectionOptions } from "typeorm";
// import { ProductCategory } from "../models";

const dbConfig: ConnectionOptions = {
  type: "mysql",
  host: "db",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  entities: [],
  synchronize: true,
};

export default dbConfig;