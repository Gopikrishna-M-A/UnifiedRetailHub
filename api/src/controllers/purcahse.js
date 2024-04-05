// import Purchase from '../models/purchase.js'

export const addPurchase = async (req, res) => {

  const newPurchase = new Purchase(req.body);

  try {
    await newPurchase.save();
    res.status(201).json(newPurchase);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


export const getPurchase = async (req, res) => {
  try {
    const Purchase = await Purchase.findById(req.params.id);
    res.status(200).json(Purchase);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const Purchases = await Purchase.find();
    res.status(200).json(Purchases);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

}

export const deletePurchase = async (req, res) => {
  const { id } = req.params;
  try {
    await Purchase.findByIdAndRemove(id);
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePurchase = async (req, res) => {
  const { id } = req.params;
  const updatedPurchase = req.body;
  try {
    const result = await Purchase.findByIdAndUpdate(id, updatedPurchase, { new: true });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
