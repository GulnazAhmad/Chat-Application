import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import Message from "./models/messages.model.js";
const app = express();
const server = createServer(app);

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();
  ///When a user disconnects, their userId is removed from the map.
  //Ensures the map doesn't hold stale socket IDs.
  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
  const sendMessage = async (message) => {
    try {
      const senderSocketId = userSocketMap.get(message.sender); //message.recipient gives you 'u2'.userSocketMap.get('u2') returns 'xyz456'.Now you can emit the message to that socket:
      const recipientSocketId = userSocketMap.get(message.recipient);
      // 1. Save the message to DB
      const createdMessage = await Message.create(message);
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email fullname image color")
        .populate("recipient", "id email fullname image color");
      // 3. Emit to recipient
      console.log("messagedata is here ", messageData);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }
      //send the message to sender as well
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
    } catch (err) {
      console.error("❌ Error handling sendMessage:", err);
    }
  };
  //When a client connects, the userId is extracted from the socket query string (e.g. ?userId=123).
  //That userId is then mapped to the socket ID for future tracking.
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket Id: ${socket.id}`);
    } else {
      console.log("user id not provided during connection");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
