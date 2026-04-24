import { Server } from "socket.io";
import { socketAuthenticate } from "../../Middleware/SocketAuthenticationMiddleware";
import { ISocketService } from "../../Domain/services/sockets/ISocketService";
import { INoteRepository } from "../../Domain/repositories/notes/INoteRepository";
import { SocketResponseDTO } from "../../Domain/DTOs/sockets/SocketResponseDTO";
import { socketAuthorize } from "../../Middleware/SocketAuthorizationMiddleware";
import { makePatches,applyPatches,stringifyPatch,parsePatch } from "@sanity/diff-match-patch";



export class SocketService implements ISocketService {
    private io: Server;
    private httpServer;
    private masterCopies: Map<string, string> = new Map();

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
        this.io.on("connection", async (socket) => {
            console.log("Client connection... " + socket.id);

            const room = this.io.sockets.adapter.rooms.get(socket.data.room);
            const size = room ? room.size : 0;

            if (size <= 0) {
                let note = await this.noteRepo.getByID(socket.data.room);
                if (note == null) {
                    socket.disconnect(true);
                }

                this.masterCopies.set(socket.data.room, note.content);
            }

            

            socket.join(socket.data.room);

            socket.on("request-sync", () => {
                console.log("syncing...");
                socket.emit("sync-text", this.masterCopies.get(socket.data.room));
            })

            socket.on("update-text", (data) => {
                const room = Array.from(socket.rooms).filter(id => id !== socket.id)[0];
                if (room == null) {
                    // Something wrong, disconnect, handle appropriatelly
                    socket.disconnect(true);
                    console.log("Room null disconnect!");
                }

                // Patch
                let current = this.masterCopies.get(room) || "";

                try {
                        
                        const [newValue] = applyPatches(data, current);
                        socket.to(room).emit("update-text", data)
                        this.masterCopies.set(room, newValue);
                }

                catch (err) {
                    console.log("Failed to apply patch!", err);
                }    
            })

            socket.on("disconnecting", async () => {
                const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);

                for (let room of rooms) {
                    let note = await this.noteRepo.getByID(Number(room));
                    if (note.owner == socket.data.user.id) {
                        // If owner disconnects, disconnect everybody
                        this.io.in(room).disconnectSockets(true);
                        console.log("Owner left, disconnected everybody in room " + room);
                    }
                }
            })

        });

        
        this.httpServer.listen(3000);
        console.log("Socket sercice on port 3000!")
    }
}