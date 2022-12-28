import express, { Request, Response } from "express";
import { NotFoundError, requireAuth } from "@tixcuborg/common";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth, 
  async (req: Request, res: Response) => {

  }
);

export { router as getOrderByIdRouter };
