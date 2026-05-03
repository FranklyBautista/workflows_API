import { Router } from "express";
import prisma from "../../config/prisma";
import {loginController,logoutController,meController,registerController} from "./controller"
import { authMiddleware } from "../../shared/middlewares/authMiddleware";
import { Role } from "../../generated/prisma/enums";
import { authorizeRoles } from "../../shared/middlewares/authMiddleware";

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


router.post("/register",registerController)

router.post("/login", loginController)

router.post("/logout", logoutController)

router.get("/me", authMiddleware,meController)

router.get(
  "/test-admin",
  authMiddleware,
  authorizeRoles(Role.ADMIN),
  (_req, res) => {
    res.json({
      success: true,
      message: "You are an admin",
    });
  }
);

export default router;