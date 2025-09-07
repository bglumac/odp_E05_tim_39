import { DatabaseConnection } from "./Database/connection/DbConnectionPool";
import { UserRepository } from "./Database/repositories/UserRepository";
import { User } from "./Domain/models/User";
import server from "./server";

require('dotenv').config()


// Constants
const PORT = process.env.PORT || 8000;

// Boot Sequence
async function main() {
    // Initialize databaze
    await DatabaseConnection.Connect();
    

    // Open web server
    server.listen(PORT, () => {
        console.log(`Server listening on: http://localhost:${PORT}`)
    });
}

(async () => await main())();