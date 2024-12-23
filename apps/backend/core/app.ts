import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";
import apiRouter from "./api";
import authRouter from "./auth";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRouter());
app.use("/api", apiRouter());

export default app;

export const api = onRequest(app);
