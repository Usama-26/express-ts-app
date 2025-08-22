import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword } from "../lib/utils";
import { catchAsync } from "../lib/catch-async";

// Get all users
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: users,
    });
  }
);

// Get one user
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = User.findByPk(id);
  try {
    res.status(200).json({
      status: "success",
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Failed to fetch users" });
  }
};

// Create user
export const createUser = async (req: Request, res: Response) => {
  const { password, email, first_name, last_name, type } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      password: hashedPassword,
      email,
      first_name,
      last_name,
      type,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [updated] = await User.update(req.body, { where: { id } });
    if (!updated) res.status(404).json({ error: "User not found" });
    const updatedUser = await User.findByPk(id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
