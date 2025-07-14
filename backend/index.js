import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouters from "./routes/users.route.js";
import criminalRouters from "./routes/criminal.route.js";

import { connectDB } from "./db/connectDb.js";
import authRouters from "./routes/auth.route.js";

dotenv.config();

const app = express(); // <-- app must be declared first

// Then add middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // if you use cookies or auth headers
  })
);

// No need to call cors() twice; remove the second call
// app.use(cors());


// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

app.use(express.json()); // parse JSON bodies
app.use(cookieParser()); // parse cookies
app.use("/api/auth", authRouters);

app.use("/api/users", userRouters);
app.use('/api/criminals', criminalRouters);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  connectDB(process.env.MONGO_URI);
  console.log(`Server is running on port: ${port}`);
});
