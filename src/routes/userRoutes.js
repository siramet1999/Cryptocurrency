import express from 'express';
import { registerUser, loginUser,getUser, updateUser ,deleteUser} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// Route สำหรับการลงทะเบียนผู้ใช้
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me',authMiddleware, getUser); 
router.patch('/update',authMiddleware, updateUser);
router.delete('/delete',authMiddleware, deleteUser);
export default router;
