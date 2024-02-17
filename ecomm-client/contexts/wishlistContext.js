'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useSession } from "next-auth/react"


const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          const response = await axios.get(`${baseURL}/api/wishlist/${user._id}`);
          setWishlist(response?.data?.products);
        } else {
          setWishlist([]); // Set an empty cart if no user
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [toggle]); // Add dependencies if needed

  const addToWishlist = async (productId) => {
    try {
      axios.post(`${baseURL}/api/wishlist/${productId}/${user._id}`).then(res => {
        setWishlist(res.data.products);
      })
      message.success('Added to wishlist');
    } catch (error) {
      console.error(error);
      message.error('Failed to add to wishlist');
    }finally{
      setToggle(!toggle);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${baseURL}/api/wishlist/${productId}/${user._id}`)
      message.success('Removed from wishlist');
    } catch (error) {
      console.error(error);
      message.error('Failed to remove from wishlist');
    }finally{
      setToggle(!toggle);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isLoading, error }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};