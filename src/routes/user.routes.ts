import express from "express";
import * as UserControllers from "../controllers/user.controllers";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { requestOtpLimiter } from "../middlewares/rateLimiter.middlewares";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - mobile
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict
 */
router.post("/", UserControllers.createUser);
/**
 * @swagger
 * /api/users/verify:
 *   post:
 *     summary: Verify OTP for user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify", UserControllers.verifyOtp);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials or account not verified
 */
router.post("/login", UserControllers.login);
/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *     security:
 *       - bearerAuth: []
 */
router.put("/update", authMiddleware, UserControllers.updateUser);
/**
 * @swagger
 * /api/users/request-otp:
 *   post:
 *     summary: Request password change
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *             required:
 *               - email
 *               - mobile
 *     responses:
 *       200:
 *         description: OTP sent for password change
 *       404:
 *         description: User not found
 */
router.post("/request-otp", requestOtpLimiter, UserControllers.requestOtp);
/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *             required:
 *               - mobile
 *               - newPassword
 *               - otp
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post("/change-password", UserControllers.changePassword);

export default router;
