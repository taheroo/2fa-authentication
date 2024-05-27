import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be less than 255 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  mobile: z
    .string()
    .min(8, { message: "Mobile number must be at least 8 characters long" })
    .max(16, { message: "Mobile number must be less than 16 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  otp: z.string().optional(),
  otpExpireTime: z.date().optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z.string().min(6, { message: "Invalid OTP" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

export const requestOtpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  mobile: z
    .string()
    .min(8, { message: "Mobile number must be at least 8 characters long" })
    .max(16, { message: "Mobile number must be less than 16 characters" }),
});

export const changePasswordSchema = z.object({
  mobile: z
    .string()
    .min(8, { message: "Mobile number must be at least 8 characters long" })
    .max(16, { message: "Mobile number must be less than 16 characters" }),
  otp: z.string().min(6, { message: "Invalid OTP" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
