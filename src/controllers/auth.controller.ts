import { Request, Response } from "express";
import { generateOTP, hashPassword, verifyPassword } from "../lib/utils";
import User from "../models/user.model";
import { sendOTPEmail } from "../services/email.service";
import { signAccessToken, signRefreshToken } from "../lib/jwt-helpers";

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export const signup = async (req: Request, res: Response, next: Function) => {
  const { password, ...rest } = req.body;
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user)
      res.status(400).json({
        status: "failed",
        message: "A user with this email already exists.",
      });

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      password: hashedPassword,
      ...rest,
    });
    req.body = newUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      res.status(400).json({ status: "failed", message: "User not found" });

    const isMatch = verifyPassword(password, user?.password as string);

    if (!isMatch)
      res
        .status(400)
        .json({ status: "failed", message: "Invalid credentials" });

    const payload = { id: user?.id, email: user?.email, type: user?.type };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { token: { accessToken, refreshToken }, user },
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: "Login failed" });
  }
};

export const sendOTP = async (req: Request, res: Response) => {
  const { email, first_name, last_name } = req.body;
  const full_name = `${first_name} ${last_name}`;

  if (!email)
    res.send(400).json({ status: "failed", message: "Email is required" });

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  try {
    otpStore.set(email, { otp, expiresAt });
    await sendOTPEmail(email, full_name, otp);
    res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      data: { email },
    });
  } catch (error) {
    console.error("OTP send failed:", error);
    res.status(500).json({ status: "failed", message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);
  const expiresAt = record?.expiresAt || 0;

  if (!record) {
    res
      .status(400)
      .json({ status: "failed", message: "OTP expired or not found" });
  }

  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    res.status(400).json({ status: "failed", message: "OTP expired" });
  }

  if (record?.otp !== otp) {
    res.status(400).json({ status: "failed", message: "Invalid OTP" });
  }

  otpStore.delete(email);

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      res.status(404).json({ status: "failed", message: "User not found" });

    const payload = { id: user?.id, email: user?.email, type: user?.type };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
      data: {
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to verify OTP", error });
  }
};
