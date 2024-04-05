import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({


  type:{
    type:String,
    default:'Goods'
  },
  name:{
    type: String,
    required: true,
  },
  SKU:{
    type: String,
    unique: true,
    index: true
  },
  unit:String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],



  dimention:{
    length:Number,
    width:Number,
    height:Number,
    unit:String
  },
  weight:{
    value:Number,
    unit:String
  },
  manufacturer:String,
  brand:String,
  MPN:String,
  EAN:String,
  ISBN:String,
  UPC: {
    type: String,
  },



  // Sales Information
  sellingPrice:Number,
  MRP:Number,
  salesAccount:String,
  description: String,


  // Purchase Information
  costPrice:Number,
  purchaseAccount:String,
  purchaseDescription: String,
  preferredVendor:String,


  // Track Inventory for this item 
  inventoryAccount:String,
  openingStock:String,
  openingStockRatePerUnit:Number,
  reorderPoint:Number,


  attributes: {
    type: Map,
    of: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

// Pre-save hook to automatically generate SKU
productSchema.pre('save', async function(next) {
  try {
    // Check if SKU already exists
    if (!this.SKU) {
      // Generate SKU based on name and random number
      const randomNumber = Math.floor(Math.random() * 10000);
      this.SKU = `${this.name.replace(/\s/g, '')}-${randomNumber}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product