import mongoose from "mongoose"
import Category from "./Category"

const variantSchema = new mongoose.Schema({
  sku: {
    type: String,
    unique: true,
    index: true,
  },
  variant: {
    type: String,
    enum: [
      "size",
      "color",
      "material",
      "style",
      "flavor",
      "weight",
      "volume",
      "pack",
    ],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  additionalPrice: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
})

const productSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "Goods",
  },
  name: {
    type: String,
    required: true,
  },
  SKU: {
    type: String,
    unique: true,
    index: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  images: [String],
  status: {
    type: String,
    enum: ["draft", "active", "discontinued"],
    default: "draft",
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ["cm", "in", "m"],
      default: "cm",
    },
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ["g", "kg", "ml", "l"],
      default: "g",
    },
  },
  manufacturer: String,
  brand: String,
  MPN: String,
  EAN: [String],
  ISBN: String,
  UPC: [String],
  // Sales Information
  basePrice: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  salesAccount: String,
  description: String,
  // Purchase Information
  costPrice: Number,
  purchaseAccount: String,
  purchaseDescription: String,
  preferredVendor: String,
  // Inventory Information
  inventoryAccount: String,
  initialStock: {
    type: Number,
    default: 0,
  },
  initialStockPrice: Number,
  reorderPoint: {
    type: Number,
    default: 10,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  variants: [variantSchema],
  reservedStock: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: true, // Automatically add createdAt and updatedAt fields
})

variantSchema.pre("save", function (next) {
  if (!this.SKU) {
    const randomSKU = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.SKU = `VAR-${randomSKU}`
  }
  next()
})

productSchema.pre("save", async function (next) {
  try {
    if (!this.SKU) {
      const randomNumber = Math.floor(100000 + Math.random() * 900000)
      this.SKU = randomNumber.toString()
    }
    next()
  } catch (error) {
    next(error)
  }
})

productSchema.virtual("totalStock").get(function () {
  return this.initialStock + this.variants.reduce((sum, variant) => sum + variant.stock, 0)
})


productSchema.virtual("currentPrice").get(function () {
  return this.basePrice * (1 - this.discountPercentage / 100)
})

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema)
