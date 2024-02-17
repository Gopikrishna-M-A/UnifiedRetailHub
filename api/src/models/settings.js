import mongoose from 'mongoose'


const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: mongoose.Schema.Types.Mixed,
  description: String,
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings
