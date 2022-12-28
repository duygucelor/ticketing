import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tixcuborg/common";
import { body } from "express-validator";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
  
  }
);

export { router as deleteOrderRouter };
