import { Router } from "express";
import prisma from "../../config/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      api: "running",
      database: "connected",
    });
  } catch {
    res.status(500).json({
      status: "error",
      api: "running",
      database: "disconnected",
    });
  }
});

export default router;