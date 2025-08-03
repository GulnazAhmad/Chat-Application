import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { connectDB } from "./lib/db.js";
import authrouter from "./routes/auth.route.js";
import contactrouter from "./routes/contacts.route.js";
import messagesrouter from "./routes/message.route.js";
import { ImOpt } from "react-icons/im";
import setupSocket from "./socket.js";
import { createServer } from "http"; // ✅ import this

//import { Server } from "http";

dotenv.config();

const app = express();
const server = createServer(app); // ✅ create server here

app.use(
  cors({
    origin: [process.env.ORIGIN],
    credentials: true,
  })
);
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
app.use(express.json());
app.use(cookieParser());
setupSocket(server);
app.use("/api/auth", authrouter);
app.use("/api", contactrouter);
app.use("/api/messages", messagesrouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`listening on port ` + PORT);
  connectDB();
});
