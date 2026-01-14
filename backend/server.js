import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";
import mongoose from "mongoose";

import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";

dotenv.config();

/* -------------------- APP & SERVER -------------------- */
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

/* -------------------- MULTER SETUP -------------------- */
const upload = multer({
  dest: "uploads/",
});



/* -------------------- ROUTES -------------------- */
app.use("/api/v1/users", userRoutes);


app.use("/uploads", express.static("uploads"));


/* Example API using multer + OpenAI */
 app.post("/api/v1/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const audioFile = fs.createReadStream(req.file.path);

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-transcribe",
    });

    fs.unlinkSync(req.file.path); // delete temp file

    res.json({
      success: true,
      text: response.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

/* -------------------- SERVER START -------------------- */
const start = async () => {
  try {
    app.set("AanchalSharma"); // custom app setting
    const connectionDb = await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `✅ MongoDB Connected: ${connectionDb.connection.host}`
    );

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error);
  }
};

start();

















// import express from "express";
// import { createServer } from "node:http";
// import dotenv from "dotenv";
// import multer from "multer";
// import fs from "fs";
// import OpenAI from "openai";

// dotenv.config();
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import { connectToSocket } from "./controllers/socketManager.js";
// import cors from "cors";
// import userRoutes from "./routes/users.routes.js";

// const app = express();
// const server = createServer(app);
// const io = connectToSocket(server);
// app.set("port", process.env.PORT || 8000);
// app.use(cors());
// app.use(express.json({ limit: "40kb" }));
// app.use(express.urlencoded({ limit: "40kb", extended: true }));
// app.use("/api/v1/users", userRoutes);
// const start = async () => {
//   app.set("AanchalSharma");
//   const connectionDb = await mongoose.connect(process.env.MONGODB_URI);
//   console.log(`MONGO Connected DB HOst: ${connectionDb.connection.host}`);
//   server.listen(app.get("port"), () => {
//     console.log("LISTENIN ON PORT 8000");
//   });
// };
// start();
