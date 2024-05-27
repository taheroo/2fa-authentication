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
// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Middleware to hash password before updating user
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as { password?: string };
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
