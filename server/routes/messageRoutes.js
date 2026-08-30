import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendMessage, getUserMessages, markMessagesRead } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.post('/send', protect, sendMessage);
messageRouter.get('/user', protect, getUserMessages);
messageRouter.post('/mark-read', protect, markMessagesRead);

export default messageRouter;
