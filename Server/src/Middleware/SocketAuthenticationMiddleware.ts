import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

interface JwtPayload {
    id: number;
    username: string;
    permission: string;
}

export const socketAuthenticate = (
    socket: Socket,
    next: (err?: Error) => void
): void => {
    console.log("Authenticating socket client...");
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error("Missing token"));
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET ?? ""
        ) as JwtPayload;

        // attach user to socket (like req.user)
        console.log("Authenticated client: " + decoded.username);
        socket.data.user = decoded;

        next();
    } catch (err) {
        console.log("Invalid or expired token...");
        next(new Error("Invalid or expired token"));
    }
}