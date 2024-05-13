import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  entries: [
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
      rate: {
        type: Number,
        required: true,
      },
      MRP:{
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      }
    },
  ],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  billNumber: {
    type: String,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  billDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paymentTerms: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
  },
  adjustment: {
    type: Number,
  },
  tds:{
    type: Number,
  },
  subTotal:{
    type: Number,
  },
  total:{
    type: Number,
  },
  balance:{
    type: Number,
  },
  status:{
    type:String,
    enum: ["Pending", "Paid", "Cancelled"],
    default:'Pending'
  }
  
});

const Purchase = mongoose.model("Purchase", PurchaseSchema);

export default Purchase;
