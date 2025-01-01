import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: ["http://localhost:5173"] } });

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Display Online users
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  // io.emit() is Used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Add handler for profile updates
  socket.on("profileUpdate", ({ userId, newProfilePic }) => {
    // Broadcast the profile update to all clients except the sender
    socket.broadcast.emit("profilePicUpdate", {
      userId,
      newProfilePic,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { server, io, app };
