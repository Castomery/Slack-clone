import express from 'express';
import "dotenv/config";
import cors from "cors";
import { ENV } from './configs/env.js';

const app = express();
const PORT = ENV.PORT; 

app.use(express.json())
app.use(cors());

app.get('/', (req,res) => res.send("Api is working"));

app.listen(5000, () => console.log("Server is running on port:", PORT));