import Promotion from '../models/promotions.js'


export const createPromotion = async (req, res) => {
  try {
    const newPromotion = new Promotion(req.body);
    await newPromotion.save();
    res.status(201).json(newPromotion);
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.json(promotions);
  } catch (error) {
    console.error('Error getting promotions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 




export const getPromotion = async (req, res) => {
  try {
    const promotionId = req.params.promotionId;
    const promotion = await Promotion.findById(promotionId);
    
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    
    res.json(promotion);
  } catch (error) {
    console.error('Error getting promotion by ID:', error);
    res.status(400).json({ error: 'Bad request' });
  }
} 




export const updatePromotion = async (req, res) => {
  try {
    const promotionId = req.params.promotionId;
    const updatedPromotion = await Promotion.findByIdAndUpdate(promotionId, req.body, {
      new: true,
    });

    if (!updatedPromotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    
    res.json(updatedPromotion);
  } catch (error) {
    console.error('Error updating promotion by ID:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const deletePromotion = async (req, res) => {
  try {
    const promotionId = req.params.promotionId;
    const deletedPromotion = await Promotion.findByIdAndDelete(promotionId);

    if (!deletedPromotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotion by ID:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   
