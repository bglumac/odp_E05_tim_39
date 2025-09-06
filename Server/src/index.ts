import { DatabaseConnection } from "./Database/connection/DbConnectionPool";
import { UserRepository } from "./Database/repositories/UserRepository";
import { User } from "./Domain/models/User";
import server from "./server";

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

    let repo = new UserRepository();
    await repo.create(new User(1, "Dzigi", "testpass", 1));
    console.log(await repo.getByID(1));
    console.log(await repo.exists(1));
    await repo.delete(1);
    console.log(await repo.exists(1));
}

(async () => await main())();