import express from "express";
import { getSteramToken } from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.get("/token", protectRoute,getSteramToken);

export default chatRouter;