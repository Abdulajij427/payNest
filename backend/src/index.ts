
import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRouter from './routes/index.js';






const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1', mainRouter)



app.listen(3000);




