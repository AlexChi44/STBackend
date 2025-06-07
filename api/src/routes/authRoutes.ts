import { Router, Request, Response } from "express";
import { check } from "express-validator";
import { AuthController } from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("login").isEmail().withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    validateRequest,
  ],
  (req: Request, res: Response) => authController.register(req, res)
);

router.post(
  "/login",
  [
    check("login").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  (req: Request, res: Response) => authController.login(req, res)
);

export default router;
