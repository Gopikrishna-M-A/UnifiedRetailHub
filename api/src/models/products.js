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
    reorderPoint:{
      type:Number,
      default:10
    },

    attributes: {
      type: Map,
      of: String,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    stockQuantity: {
      type: Number,
      default: 0
    },
    reservedQuantity: {
      type: Number,
      default: 0
    }
    
  });

  // Pre-save hook to automatically generate SKU
  productSchema.pre('save', async function(next) {
    try {
      // Generate random number for SKU
      const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
      this.SKU = randomNumber.toString();
      next();
    } catch (error) {
      next(error);
    }
  });

  const Product = mongoose.model('Product', productSchema);

  export default Product