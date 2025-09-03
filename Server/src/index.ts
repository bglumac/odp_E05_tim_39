import db from "./Database/connection/DbConnectionPool";
import server from "./server";

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server listening on: http://localhost:${PORT}`)
});

db;