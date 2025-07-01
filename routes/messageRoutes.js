import express from 'express';
import { getMessages,deleteChat } from '../controllers/messageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getMessages);
router.delete('/', verifyToken, deleteChat);

export default router;
