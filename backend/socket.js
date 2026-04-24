import { Server } from "socket.io";

let io;
const users = new Map();

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", ({ userId, role }) => {
      if (userId) {
        registerSocketUser(userId, socket.id);
      }

      if (role) {
        socket.join(role);
      }

      console.log("Socket registered:", userId, role);
    });

    socket.on("join", ({ userId, role }) => {
      if (userId) {
        registerSocketUser(userId, socket.id);
      }

      if (role) {
        socket.join(role);
      }

      console.log("Socket joined:", userId, role);
    });

    socket.on("disconnect", () => {
      unregisterSocket(socket.id);
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

export function getIo() {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
}

export function registerSocketUser(userId, socketId) {
  users.set(String(userId), socketId);
}

export function unregisterSocket(socketId) {
  for (const [userId, id] of users.entries()) {
    if (id === socketId) {
      users.delete(userId);
      break;
    }
  }
}

export function emitToUser(userId, event, data) {
  const socketId = users.get(String(userId));
  if (socketId && io) {
    io.to(socketId).emit(event, data);
  }
}

export function emitToRole(role, event, data) {
  if (io) {
    io.to(role).emit(event, data);
  }
}