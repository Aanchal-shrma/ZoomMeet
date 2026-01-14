import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";

dotenv.config();

const app = express();
const server = createServer(app);
connectToSocket(server);

/* CORS */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://zoommeet.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  })
);

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));





/* Routes */
app.use("/api/v1/users", userRoutes);


/* Start */
const start = async () => {
  try {
    const connectionDb = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${connectionDb.connection.host}`);

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Server start failed:", error);
  }
};

start();
