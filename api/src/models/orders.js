import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String
    // enum: ["Pending", "Paid", "Cancelled"],
    // default: "Pending",
  },
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  orderStatus: [
    {
      status: {
        type: String,
        enum: ["Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Refunded", "Completed"],
        default: "Processing",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  paymentId: String,
  OrderId: String,
  signature: String,
  method: String,
  orderNumber: {
    type: Number,
    required: true,
  },
  phase: {
    type: Number,
    default:0
  }
});


const Order = mongoose.model('Order', orderSchema);

export default Order
