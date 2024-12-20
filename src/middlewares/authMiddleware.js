import jwt from 'jsonwebtoken';

// Middleware สำหรับตรวจสอบ JWT Token
export default function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log( req.user );
    
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}
