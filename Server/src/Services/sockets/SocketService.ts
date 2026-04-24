import { Server } from "socket.io";
import { socketAuthenticate } from "../../Middleware/SocketAuthenticationMiddleware";
import { ISocketService } from "../../Domain/services/sockets/ISocketService";
import { INoteRepository } from "../../Domain/repositories/notes/INoteRepository";
import { SocketResponseDTO } from "../../Domain/DTOs/sockets/SocketResponseDTO";
import { socketAuthorize } from "../../Middleware/SocketAuthorizationMiddleware";



export class SocketService implements ISocketService {
    private io: Server;
    private httpServer;

    public constructor(
        /* Trebace mi repository */ 
        private noteRepo: INoteRepository
    ) {
        this.httpServer = require("http").createServer();
        this.io = new Server(this.httpServer, {
            cors: {
                origin: "*",
            }
        });
    }

    initialize(): void {
        console.log("Initializing socket service!");
        // Svaka konekcija mora da ima korisnika
        this.io.use(socketAuthenticate);

        // Svaka konekcija mora biti autorizovana
        this.io.use(socketAuthorize(this.io, this.noteRepo));

        // Inicijalna konekcija
        this.io.on("connection", (socket) => {
            console.log("Client connection...");
            socket.join(socket.data.room);

            socket.on("update-text", () => {
                const room = Array.from(socket.rooms).filter(id => id !== socket.id)[0];
                if (room == null) {
                    // Something wrong, discconect, handle appropriatelly
                }

                this.io.to(room).emit("update-text", "yay");          
            })

            socket.on("disconnecting", async () => {
                const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);

                for (let room in rooms) {
                    let note = await this.noteRepo.getByID(Number(room));
                    if (note.owner == socket.data.user.id) {
                        // disconnect everybody in that room
                        this.io.in(room).disconnectSockets(true);
                        console.log("Owner left, disconnected everybody in room " + room);
                    }
                }
            })

        });

        // If owner disconnects, disconnect everybody

        this.httpServer.listen(3000);
        console.log("Socket sercice on port 3000!")
    }

}