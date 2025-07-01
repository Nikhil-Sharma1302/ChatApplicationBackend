import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import { PORT, MONGO_URI } from "./config.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Message from "./models/Message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(MONGO_URI)
  .then(console.log("Connetion Established"))
  .catch((err) => {
    console.log(err);
  });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send-message", async (data) => {
    const { senderId, receiverId, content } = data;
    const message = await Message.create({ senderId, receiverId, content });
    io.emit("receive-message", message);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
