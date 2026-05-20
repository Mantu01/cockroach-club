import { Router } from "express";
import { getJobs } from "../controllers/jobs.controller.js";

const router = Router();

router.get("/", getJobs);

export default router;