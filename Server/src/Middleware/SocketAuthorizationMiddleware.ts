import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { INoteRepository } from "../Domain/repositories/notes/INoteRepository";

interface JwtPayload {
    id: number;
    username: string;
    permission: string;
}

export const socketAuthorize = (io: Server, noteRepo: INoteRepository) => {
    return async (socket: Socket, next: Function) => {
        const { roomId } = socket.handshake.auth;

        if (!roomId) {
            return next(new Error("Room not defined!"));
        }

        const room = io.sockets.adapter.rooms.get(roomId);
        const size = room ? room.size : 0;

        // Prvi koji inicira konekciju, MORA biti vlasnik
        if (size <= 0) {
            let note = await noteRepo.getByID(roomId);
            if (note.owner != socket.data.user.id) {
                return next(new Error("Not authorized!"));
            }
        }

        // Svi ostali mogu da se prikljuce
        socket.data.room = roomId;
        next();
    };
};