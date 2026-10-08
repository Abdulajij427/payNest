
import express  from "express";
import cors from "cors";
import { initializeDatabase } from "./db.js";
import { PORT } from "./config.js";
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || true }));
app.use(express.json());
import mainRouter from './routes/index.js';







app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use('/api/v1', mainRouter);



async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer().catch((error) => {
  console.error("Unable to start server", error);
  process.exit(1);
});




// and transfer endpoint , 1. an endpoint for user tog get their balance , 2. an endpoint for user to transfer money to another account  
