import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  attributeKeys: {
    type: [String],
    default: [],
  },
},
{
  timestamps: true, // Automatically add createdAt and updatedAt fields
});


export default mongoose.models.Category || mongoose.model("Category", categorySchema)