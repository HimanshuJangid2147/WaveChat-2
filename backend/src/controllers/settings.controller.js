import Settings from '../models/settings.model.js';

export const getUserSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });
    
    if (!settings) {
      settings = await Settings.create({ userId: req.user._id });
    }
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { fontSize, notifications, messageSound, onlineStatus, readReceipts } = req.body;
    
    const updateData = {};
    if (fontSize) updateData.fontSize = fontSize;
    if (notifications !== undefined) updateData.notifications = notifications;
    if (messageSound !== undefined) updateData.messageSound = messageSound;
    if (onlineStatus !== undefined) updateData.onlineStatus = onlineStatus;
    if (readReceipts !== undefined) updateData.readReceipts = readReceipts;

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true, upsert: true }
    );
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const resetSettings = async (req, res) => {
  try {
    const defaultSettings = {
      fontSize: 'medium',
      notifications: true,
      messageSound: true,
      onlineStatus: true,
      readReceipts: true
    };

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user._id },
      defaultSettings,
      { new: true, upsert: true }
    );
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};