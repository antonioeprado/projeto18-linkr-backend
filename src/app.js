import { express } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = 4000 || process.env.PORT;
app.listen(PORT, () => {
	`Server running on port: ${PORT}`;
});
