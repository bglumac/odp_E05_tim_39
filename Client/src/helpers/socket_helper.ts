import { io, Socket } from "socket.io-client";

const connectSocket = (token: string) => {
  return new Promise<Socket>((resolve, reject) => {
    const socket = io("ws://localhost:3000", {
      auth: { token }
    });

    const timeout = setTimeout(() => {
      reject(new Error("Socket connection timeout"));
    }, 5000);

    socket.on("connect", () => {
      clearTimeout(timeout);
      resolve(socket);
    });

    socket.on("connect_error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export { connectSocket };