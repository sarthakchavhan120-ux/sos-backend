import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";

dotenv.config();

const app = express();   // 👈 MUST BE FIRST

app.use(cors());
app.use(express.json());

// ROUTES (AFTER app creation)
app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("SOS API Running");
});

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});