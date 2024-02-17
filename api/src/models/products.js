import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  attributes: {
    type: Map,
    of: String,
  },
  // attributeValues: {
  //   type: [String],
  //   default: [],
  // },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product