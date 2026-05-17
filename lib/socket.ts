// lib/socket.ts
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";

export function initializeSocketServer(server: NetServer) {
  const io = new ServerIO(server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("room:join", ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on("message:send", ({ roomId, message }) => {
      socket.to(roomId).emit("message:received", message);
    });

    socket.on("room:leave", ({ roomId }) => {
      socket.leave(roomId);
    });
  });

  return io;
}