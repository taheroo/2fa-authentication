import { Request, Response } from "express";
import * as UserServices from "../services/user.services";
import { MongoDBError } from "../types/mongodb-error.types";
import { MONGO_ERROR_CODES } from "../constants/mongodb-error-codes";
import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
  requestOtpSchema,
  updateUserSchema,
  verifyOtpSchema,
} from "../validations/user.validations";
import logger from "../services/logger";
import UserModel from "../models/user.models";
import { sendOtp } from "../services/twilio";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { error, data } = createUserSchema.safeParse(req.body);
    if (error) {
      return res.status(400).send(error.format());
    }
    const user = await UserServices.findByEmailOrMobile(
      data.email,
      data.mobile.trim()
    );
    if (user && !user.isVerified) {
      return res
        .status(409)
        .send(
          "A user with the same email/mobile already exists. Please verify your account."
        );
    }
    if (user) {
      return res
        .status(409)
        .send("A user with the same email/mobile already exists.");
    }
    let { otp, otpExpireTime } = UserServices.generateOtp();
    data.otp = otp;
    data.otpExpireTime = otpExpireTime;
    try {
      logger.info("Sending OTP", {
        mobile: data.mobile,
        email: data.email,
        otp,
        otpExpireTime,
      });
      await sendOtp(data.mobile, otp);
    } catch (error) {
      logger.error("Error while sending OTP", { error });
      data.otpExpireTime = undefined;
      data.otp = undefined;
    }
    logger.info("Creating user", { body: req.body });
    const result = await UserServices.createUser(data);
    if (!result.otp) {
      return res.status(500).send("Error while creating user");
    }
    res.status(201).send("User created successfully");
  } catch (error) {
    const e = error as MongoDBError;
    if (e.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
      res.status(409).send("A user with the same email/mobile already exists.");
    } else {
      res.status(400).send(e);
    }
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { data, error } = verifyOtpSchema.safeParse(req.body);
    if (error) {
      return res.status(400).send(error.format());
    }
    const isCorrectOtp = await UserServices.verifyOtp(data.email, data.otp);
    if (!isCorrectOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const user = await UserServices.verifyAccount(data.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = UserServices.generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { data, error } = loginSchema.safeParse(req.body);
    if (error) {
      return res.status(400).send(error.format());
    }
    const user = await UserServices.verifyLogin(data.email, data.password);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Account not verified" });
    }
    const token = UserServices.generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { error, data } = updateUserSchema.safeParse(req.body);
    if (error) {
      return res.status(400).send(error.format());
    }
    const user = await UserServices.updateUser(userId, data);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { data, error } = requestOtpSchema.safeParse(req.body);
    if (error) {
      return res.status(400).send(error.format());
    }
    const { otp, otpExpireTime } = UserServices.generateOtp();
    const user = await UserServices.updateUserOtp(
      data.email,
      otp,
      otpExpireTime
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    try {
      logger.info("Sending OTP", {
        mobile: data.mobile,
        email: data.email,
        otp,
        otpExpireTime,
      });
      await sendOtp(data.mobile, otp);
    } catch (error) {
      logger.error("Error while sending OTP", { error });
    }

    res.json({ message: "OTP sent for password change" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { data, error } = changePasswordSchema.safeParse(req.body);
    if (error) {
      return res.status(400).send(error.format());
    }
    const isCorrectOtp = await UserServices.verifyOtp(data.mobile, data.otp);
    if (!isCorrectOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const user = await UserServices.updatePassword(
      data.mobile,
      data.newPassword
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
