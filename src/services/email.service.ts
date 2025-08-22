import nodemailer from "nodemailer";
import { ENV } from "../config/env";
import { generateEmailTemplate } from "../lib/utils";

export const transporter = nodemailer.createTransport({
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_KEY,
  },
  port: Number(ENV.SMTP_PORT),
  host: ENV.SMTP_HOST,
  secure: false,
});

export const sendOTPEmail = async (
  to: string,
  fullName: string,
  otp: string
) => {
  const htmlContent = generateEmailTemplate(fullName, otp);

  try {
    const info = await transporter.sendMail({
      from: "Strider's Hobby <m.a.vfxpoint@gmail.com>",
      to,
      subject: "Verify Your Email with OTP",
      html: htmlContent,
    });

    console.log("Email sent:", info);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};
