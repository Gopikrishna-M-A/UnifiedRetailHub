import Inventory from '../models/inventory.js'

export const getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.json(inventoryItems);
  } catch (error) {
    console.error('Error getting inventory items:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   




export const getInventoryItem = async (req, res) => {
  try {
    const inventoryItemId = req.params.inventoryItemId;
    const inventoryItem = await Inventory.findById(inventoryItemId);
    
    if (!inventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    res.json(inventoryItem);
  } catch (error) {
    console.error('Error getting inventory item by ID:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   




export const updateInventoryItem = async (req, res) => {
  try {
    const inventoryItemId = req.params.inventoryItemId;
    const { stockQuantity, reservedQuantity } = req.body;

    // Validate input, ensuring stockQuantity and reservedQuantity are valid numbers
    if (isNaN(stockQuantity) || isNaN(reservedQuantity)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const updatedInventoryItem = await Inventory.findByIdAndUpdate(
      inventoryItemId,
      { stockQuantity, reservedQuantity },
      { new: true }
    );

    if (!updatedInventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(updatedInventoryItem);
  } catch (error) {
    console.error('Error updating inventory item by ID:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   

