import express from "express";
import dotenv from "dotenv";
import router from "./routes/auth.routes.js";
import cors from "cors";
dotenv.config();

import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(authRouter);

const PORT = 4000 || process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});
