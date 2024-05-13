import Purchase from "../models/purchase.js";
import Product from "../models/products.js";

export const addPurchase = async (req, res) => {
  try {
    const { entries } = req.body;
    console.log("req.body",req.body);
    await Promise.all(
      entries.map(async (entry) => {
        const product = await Product.findById(entry.product);

        if (!product) {
          throw new Error(`Product with ID ${entry.product} not found`);
        }

        // Update product quantity, rate, and MRP
        product.stockQuantity = parseFloat(product.stockQuantity) + parseFloat(entry.quantity);
        product.costPrice = entry.rate; // Update rate with costPrice
        product.MRP = entry.MRP; // Update MRP with MRP of the product

        await product.save();
      })
    );
    const newPurchase = new Purchase(req.body);
    await newPurchase.save();

    const populatedPurchase = await Purchase.findById(newPurchase._id).populate('vendor').populate('entries.product')
    return res.status(201).json({ Purchase:populatedPurchase });


  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(400).json({ error: "Bad request" });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate('vendor').populate('entries.product')
    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error getting purchases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }
    res.status(200).json(purchase);
  } catch (error) {
    console.error("Error getting purchase:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const deletedPurchase = await Purchase.findByIdAndRemove(purchaseId);
    if (!deletedPurchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const updatedPurchaseData = req.body;
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      purchaseId,
      updatedPurchaseData,
      { new: true }
    );
    if (!updatedPurchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }
    res.status(200).json(updatedPurchase);
  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
