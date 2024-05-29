import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel, { User } from "../models/user.models";
import { JWT_SECRET } from "../constants";

export const createUser = async (user: User) => {
  user.mobile = user.mobile.trim();
  // Hash the plain text password before saving
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const newUser = new UserModel(user);
  await newUser.save();
  return newUser;
};

export const findByEmailOrMobile = async (email: string, mobile?: string) => {
  return await UserModel.findOne({
    $or: [{ email: email }, { mobile: mobile }],
  });
};

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  let otpExpireTime = new Date(Date.now() + 3600000);
  return { otp, otpExpireTime };
};

export const generateToken = (user: User) => {
  return jwt.sign({ _id: user._id, name: user.name }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyOtp = async (
  query: string,
  password: string,
  otp: string
) => {
  const user = await UserModel.findOne({
    $or: [{ email: query }, { mobile: query }],
  });
  if (!user) return false;
  const isValidOtp =
    user.otp === otp &&
    user.otpExpireTime &&
    user.otpExpireTime.getTime() > Date.now();
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidOtp || !isValidPassword) return false;
  return true;
};

export const verifyAccount = async (email: string) => {
  const user = await UserModel.findOneAndUpdate(
    { email },
    {
      $set: { isVerified: true },
      $unset: { otp: "", otpExpireTime: "" },
    },
    { new: true }
  );
  return user;
};

export const verifyLogin = async (email: string, password: string) => {
  const user = await UserModel.findOne({
    email,
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }
  return user;
};

export const updateUser = async (userId: string, data: Partial<User>) => {
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }
  const user = await UserModel.findOneAndUpdate({ _id: userId }, data, {
    new: true,
  });
  return user;
};

export const updateUserOtp = async (
  email: string,
  otp: string,
  otpExpireTime: Date
) => {
  const user = await UserModel.findOneAndUpdate(
    { email },
    { otp, otpExpireTime },
    { new: true }
  );
  return user;
};

export const updatePassword = async (mobile: string, password: string) => {
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  const user = await UserModel.findOneAndUpdate(
    { mobile },
    {
      $set: { password: hashedPassword },
      $unset: { otp: "", otpExpireTime: "" },
    },
    { new: true }
  );
  return user;
};
