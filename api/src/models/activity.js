import mongoose from 'mongoose'


const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activityType: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity