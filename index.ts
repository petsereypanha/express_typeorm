import  express  from "express";
import { AppDataBase } from "./src/config/source.date";

const app = express();
const portHost =  8080 || parseInt('8080');

async function main() {
    try{
        await AppDataBase.initialize();
        console.log("Connected to Postgres")
        app.use(express.json());
        app.listen(portHost, () => {
            console.log(`http://localhost:${portHost}`);
        });
    }
    catch(error)
    {
        console.error(error);
        throw new Error("Unable to connect to DB")
    }
}

main()