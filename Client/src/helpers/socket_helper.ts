import { io, Socket } from "socket.io-client";
let connection: Socket | null = null;

const connectSocket = (token: string, room: Number) => {
  
  return new Promise<Socket>((resolve, reject) => {
    console.log("Websockettyyy")
    if (connection != null) {
      console.log("Websockettyyy already exists")
      resolve(connection);
    }
  
    const socket = io("ws://localhost:3000", {
      auth: { 
        token: token,
        roomId: room 
      }
    });

    connection = socket;

    const timeout = setTimeout(() => {
      reject(new Error("Socket connection timeout"));
    }, 5000);

    socket.on("connect", () => {
      clearTimeout(timeout);
      connection = socket;
      resolve(socket);
    });

    socket.on("connect_error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export { connectSocket };