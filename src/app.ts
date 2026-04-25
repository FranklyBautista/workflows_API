import express from "express";
import routes from "./modules/auth/routes";


const app = express();

app.use(express.json())

app.use("/health", routes)

export default app;