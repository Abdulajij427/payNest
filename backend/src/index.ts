import {pool} from './db.js'
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { type Request , type Response} from 'express'


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());




