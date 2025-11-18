import express from "express";
import route from "./routes/route.js";

const app = express();
app.use("/api", route);

export default app;
