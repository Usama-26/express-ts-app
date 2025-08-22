import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config/constants";

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashed;
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

export const generateOTP = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
};

export const generateEmailTemplate = (firstName: string, otp: string) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 8px; padding: 24px;">
          <h2 style="color: #007BFF;">Hi ${firstName},</h2>
          <p style="font-size: 16px;">Thank you for signing up. Use the OTP below to verify your email:</p>
          <div style="font-size: 32px; font-weight: bold; margin: 24px 0; color: #000; text-align: center;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666;">This OTP will expire in 10 minutes. Please do not share it with anyone.</p>
          <hr />
          <p style="font-size: 12px; color: #aaa;">If you did not request this, you can ignore this email.</p>
        </div>
      </body>
    </html>
  `;
};
