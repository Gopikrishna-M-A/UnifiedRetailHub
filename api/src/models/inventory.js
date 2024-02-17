import mongoose from 'mongoose'


const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
  },
  reservedQuantity: {
    type: Number,
    default: 0,
  },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory
