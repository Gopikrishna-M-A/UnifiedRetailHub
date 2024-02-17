import mongoose from 'mongoose'

const staticPageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

const StaticPage = mongoose.model('StaticPage', staticPageSchema);

export default StaticPage
