import Cart from '../models/cart.js'

export const getCartItems = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const cart = await Cart.findOne({ customer: userId }).populate('products.product');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   




export const addCartItem = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const productId = req.params.productId;
    // Extract quantity from the request body
    const { quantity } = req.body;
    // Check if the user has an existing cart
    let cart = await Cart.findOne({ customer: userId });

    // If the user doesn't have a cart, create a new one
    if (!cart) {
      cart = new Cart({
        customer: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      // Check if the product is already in the cart
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );

      // If the product is in the cart, update the quantity
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        cart.products.push({ product: productId, quantity });
      }
    }

    // Save the cart
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('products.product');
    return res.status(200).json({ cart:populatedCart });

  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const updateCartItem = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the authenticated user's ID
    const productId = req.params.productId;
    const { quantity } = req.body;

    // Find the user's cart and the product in the cart
    const cart = await Cart.findOne({ customer: userId });
    const cartItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    // Update the quantity
    cartItem.quantity = quantity;

    // Save the updated cart
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('products.product');
    return res.status(200).json({ cart:populatedCart });

  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const removeCartItem = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the authenticated user's ID
    const productId = req.params.productId;

    // Find the user's cart
    const cart = await Cart.findOne({ customer: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    // Save the updated cart
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('products.product');
    return res.status(200).json({ cart:populatedCart });

  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   


export const emptyCart = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the authenticated user's ID
    const cart = await Cart.findOne({ customer: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    cart.products = [];
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('products.product');
    return res.status(200).json({ cart:populatedCart });
  } catch (error) {
    console.error('Error emptying cart:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}