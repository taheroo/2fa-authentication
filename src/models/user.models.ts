import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
  _id?: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  isVerified?: boolean;
  otp?: string;
  otpExpireTime?: Date;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpireTime: { type: Date },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
