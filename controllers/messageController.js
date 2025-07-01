import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;
  const messages = await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]
  });
  res.json({status:true,messages});
};

export const deleteChat = async (req, res) => {
  const { senderId, receiverId } = req.query;

  try {
    await Message.deleteMany({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.status(200).json({ status: true, message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete Chat Error:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};
