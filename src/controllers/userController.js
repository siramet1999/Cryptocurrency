import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const generateWalletUserId = async () => {
  let walletId;
  let exists;

  do {
    // สร้างเลข 6 หลักแบบสุ่ม
    walletId = Math.floor(100000 + Math.random() * 900000);
    // ตรวจสอบว่าเลขซ้ำหรือไม่
    exists = await prisma.user.findUnique({
      where: { walletuser_id: walletId },
    });
  } while (exists);

  return walletId;
};

// ลงทะเบียนผู้ใช้
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const walletuser_id = await generateWalletUserId();

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        walletuser_id,
      },
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// เข้าสู่ระบบผู้ใช้
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.user_id, walletuser_id:user.walletuser_id}, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
export const getUser = async (req, res) => {
  const  { userId } = req.user; // ดึง user_id จากพารามิเตอร์
 

 
  

  try {
    // ค้นหาผู้ใช้จาก ID
    const user = await prisma.user.findUnique({
      where: { user_id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
// controllers/userController.js


// ลบข้อมูลผู้ใช้
export const deleteUser = async (req, res) => {
  const  { userId } = req.user; // ดึง user_id จากพารามิเตอร์

  try {
    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const userExists = await prisma.user.findUnique({
      where: { user_id: Number(userId) },
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ลบผู้ใช้จากฐานข้อมูล
    await prisma.user.delete({
      where: { user_id: Number(userId) },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};
export const updateUser = async (req, res) => {
  const  { userId } = req.user;  // ดึง user_id จาก token (req.user) ที่ถูกตั้งใน middleware
  const { username, email } = req.body;  // ข้อมูลใหม่ที่ต้องการอัปเดต

  try {
    // ค้นหาผู้ใช้จาก user_id
    const user = await prisma.user.findUnique({
      where: { user_id: Number(userId ) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await prisma.user.update({
      where: { user_id: Number(userId ) },
      data: {
        username: username || user.username,  // ใช้ข้อมูลใหม่ หรือค่าปัจจุบันถ้าไม่ได้ส่งมา
        email: email || user.email,  // ใช้ข้อมูลใหม่ หรือค่าปัจจุบันถ้าไม่ได้ส่งมา
      },
    });

    res.status(200).json(updatedUser);  // ส่งข้อมูลผู้ใช้ที่อัปเดตแล้ว
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};
