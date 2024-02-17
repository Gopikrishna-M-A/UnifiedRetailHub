import mongoose from "mongoose";


const analyticsStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  pageViews: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
  newVisitors: {
    type: Number,
    default: 0,
  },
});

const AnalyticsStats = mongoose.model('AnalyticsStats', analyticsStatsSchema);

export default AnalyticsStats
