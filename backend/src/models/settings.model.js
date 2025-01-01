import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  notifications: {
    type: Boolean,
    default: true
  },
  messageSound: {
    type: Boolean,
    default: true
  },
  onlineStatus: {
    type: Boolean,
    default: true
  },
  readReceipts: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;