import jwt from "jsonwebtoken";

// ฟังก์ชันสำหรับสร้าง JWT token
export const generateToken = (user) => {
  return jwt.sign({ id: user.user_id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ฟังก์ชันสำหรับตรวจสอบ JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

