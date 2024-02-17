import mongoose from 'mongoose'


const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  discountCode: {
    type: String,
    required: true,
  },
  applicableProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  discountType: {
    type: String,
    enum: ["Percentage", "Fixed"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion