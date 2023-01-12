import express from "express";
import dotenv from "dotenv";
import router from "./routes/auth.routes.js";
import hashtagsRoutes from "./routes/hashtags.routes.js";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/posts.routes.js";
import likesRouter from "./routes/likes.routes.js";
import followRouter from "./routes/follow.routes.js";
import repostRouter from "./routes/repost.routes.js";
import commentsRouter from "./routes/comments.routes.js";


import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);
app.use(authRouter);
app.use(followRouter);
app.use(hashtagsRoutes);
app.use(likesRouter);
app.use(postRouter);
app.use(repostRouter);
app.use(commentsRouter);

const PORT = 4000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
