'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useSession } from "next-auth/react"


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  const [cartTotal, setCartTotal] = useState(0);
  const [cart, setCart] = useState({});
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          const response = await axios.get(`${baseURL}/api/cart/${user._id}`);
          setCart(response.data);
        } else {
          setCart([]); // Set an empty cart if no user
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [toggle]); // Add dependencies if needed

  const addToCart = async (productId, userId, quantity) => {
    try {
      const response = await axios.post(`${baseURL}/api/cart/${productId}/${user._id}`, {
        quantity,
      });

      setCart(response.data);
      message.success('Added to cart');
    } catch (error) {
      console.error(error);
      message.error('Failed to add to cart');
    }finally{
      setToggle(!toggle);
    }
  };

  const updateCart = async (productId, userId, quantity) => {
    const updatedCart = {
      ...cart,
      products: cart.products.map(product => {
        if (product.product._id === productId) {
          return {
            ...product,
            quantity
          };
        }
        return product;
      })
    };

    
 
    
    try {
      axios.patch(`${baseURL}/api/cart/${productId}/${userId}`, {
        quantity,
      });
      setCart(updatedCart);
      // console.log(response.data.cart);
      // setCart(response.data.cart);
      message.success('Cart updated');
    } catch (error) {
      console.error(error);
      message.error('Failed to update cart');
    }finally{
      // setToggle(!toggle);
    }
  };

  const removeFromCart = async (productId, userId) => {
    try {
      await axios.delete(`${baseURL}/api/cart/${productId}/${userId}`).then((res) => {
        setCart(res.data.cart);
      });

      // Update cart state based on API response or local logic
      message.success('Removed from cart');
    } catch (error) {
      console.error(error);
      message.error('Failed to remove from cart');
    }finally{
      // setToggle(!toggle);
    }
  };

  const emptyCart = async () => {
    try {
      await axios.delete(`${baseURL}/api/cart/${user._id}`);
      setCart([]);
    } catch (error) {
      console.error(error);
    }finally{
      setToggle(!toggle);
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isLoading, error, updateCart, emptyCart, setCartTotal, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};