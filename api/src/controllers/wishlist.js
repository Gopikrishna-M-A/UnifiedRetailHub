import Wishlist from '../models/wishlist.js'


 
export const getWishlist = async (req, res) => {
  const userId = req.params.userId;
  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 




export const addToWishlist = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  try {
    let wishlist = await Wishlist.findOne({ user: userId })

    if (!wishlist) {
      // If no wishlist exists, create a new one
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    // Check if the product is already in the wishlist
    if (!wishlist.products.includes(productId)) {
      // If not, add the product to the wishlist
      wishlist.products.push(productId);
      await wishlist.save();
      wishlist = await Wishlist.findOne({ user: userId }).populate('products');
      res.json(wishlist);
    } else {
      // If the product is already in the wishlist, respond accordingly
      res.json({ message: 'Product already in the wishlist' });
    }
    
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   




export const removeFromWishlist = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  try {
    let wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    
    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();
    wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    res.json(wishlist);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   
