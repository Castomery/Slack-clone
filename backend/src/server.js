import "../instrument.mjs";
import express from 'express';
import "dotenv/config";
import cors from "cors";
import { ENV } from './configs/env.js';
import { connectDB } from './configs/mongoDB.js';
import {clerkMiddleware} from "@clerk/express";
import { functions, inngest } from './configs/inngest.js';
import { serve } from "inngest/express";
import chatRouter from './routes/chat.route.js';
import * as Sentry from "@sentry/node";

const app = express();

app.use(clerkMiddleware());
app.use(express.json());
app.use(cors());

app.get('/', (req,res) => res.send("Api is working"));

app.get("/debug-sentry", (req,  res) => {
    throw new Error("sentry error");
})

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRouter);

Sentry.setupExpressErrorHandler(app);


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