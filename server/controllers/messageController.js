import Message from '../models/Message.js';
import User from '../models/User.js';
import Car from '../models/Car.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user?._id;
    const { receiverId, carId, bookingId, text } = req.body;

    if (!senderId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    let finalReceiverId = receiverId;

    // If carId provided but no receiverId, resolve car owner as receiver
    if (!finalReceiverId && carId) {
      const car = await Car.findById(carId);
      if (car && car.owner) {
        finalReceiverId = car.owner;
      }
    }

    // If still no receiver, resolve first owner or admin
    if (!finalReceiverId) {
      const anyOwner = await User.findOne({ role: 'owner', _id: { $ne: senderId } });
      if (anyOwner) {
        finalReceiverId = anyOwner._id;
      }
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: finalReceiverId,
      car: carId || null,
      booking: bookingId || null,
      text: text.trim(),
    });

    const populated = await Message.findById(newMessage._id)
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .populate('car', 'title brand model image');

    return res.status(201).json({
      success: true,
      message: 'Message dispatched successfully',
      data: populated,
    });
  } catch (error) {
    console.error('sendMessage error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get conversations for current user
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Fetch messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }, { receiver: null }],
    })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .populate('car', 'title brand model image')
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('getUserMessages error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mark conversation as read
export const markMessagesRead = async (req, res) => {
  try {
    const userId = req.user?._id;
    await Message.updateMany(
      { receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );
    return res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
