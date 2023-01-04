import express from "express";
import dotenv from "dotenv";
import router from "./routes/auth.routes.js";
import hashtagsRoutes from "./routes/hashtags.routes.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);
app.use(authRouter);
app.use(hashtagsRoutes);

const PORT = 4000 || process.env.PORT;
app.listen(PORT, () => {
  `Server running on port: ${PORT}`;
});
