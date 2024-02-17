import mongoose from "mongoose";


const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  }, // e.g., "Page View", "Product Click", "Add to Cart"
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  eventData: {
    type: mongoose.Schema.Types.Mixed,
  }, // Additional event-specific data
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
