import { DataSource } from "typeorm"
import { validate } from "../migration/validate";
// import { User } from "../entities/user.entity";

export const AppDataBase = new DataSource({
        type: "postgres",
        host: "13.236.84.76",
        port: 5432,
        username: "sereypanha",
        password: "15032002",
        database: "authtypeorm",
        // entities: [User],
        synchronize: true,
        logging: false,
        // migrations: [validate]
});