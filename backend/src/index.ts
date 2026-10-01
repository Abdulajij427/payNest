import {initDB} from './db.js'
import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRouter from './routes/index.js';












const app = express();

app.use('/api/v1', mainRouter)








