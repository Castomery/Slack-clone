import express from 'express';
import "dotenv/config";
import cors from "cors";
import { ENV } from './configs/env.js';
import { connectDB } from './configs/mongoDB.js';
import {clerkMiddleware} from "@clerk/express";
import { functions, inngest } from './configs/inngest.js';
import { serve } from "inngest/express";

const app = express();

app.use(clerkMiddleware());
app.use(express.json());
app.use(cors());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get('/', (req,res) => res.send("Api is working"));

const startServer = async() =>{
    try {
        await connectDB();

        if(ENV.NODE_ENV !== "production"){
            app.listen(ENV.PORT, ()=> {
                console.log("Server started on port:", ENV.PORT);
            });
        }
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();

export default app;