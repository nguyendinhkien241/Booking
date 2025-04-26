import express from "express";
import { getRevenue } from "../controllers/revenueController.js";

const router = express.Router();

router.get("/", getRevenue);

export default router;