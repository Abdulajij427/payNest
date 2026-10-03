
import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
app.use(cors());
app.use(express.json());
import mainRouter from './routes/index.js';







app.use('/api/v1', mainRouter)



app.listen(3000);




// and transfer endpoint , 1. an endpoint for user tog get their balance , 2. an endpoint for user to transfer money to another account  