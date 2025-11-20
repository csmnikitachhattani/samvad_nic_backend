import express from "express";
import cors from "cors";
import route from "./routes/route.js";

const app = express();

// CORS FIX
app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js frontend
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// 🔥 GLOBAL DEBUG LOGGER — ADD THIS
app.use((req, res, next) => {
  console.log("🔥 Incoming:", req.method, req.originalUrl);
  next();
});

// Base API routes
app.use("/api", route);

export default app;
