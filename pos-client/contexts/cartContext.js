"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    products: [],
    customer: null,
  });
  const cartKey = `posCart_${new Date().toISOString()}`;

  useEffect(() => {
    setCart(
      JSON.parse(localStorage.getItem("lastCart")) || {
        products: [],
        customer: null,
      }
    );

    const saveInterval = setInterval(() => {
      if (navigator.onLine) {
        setCart((prevCart) => {
          localStorage.setItem("lastCart", JSON.stringify(prevCart));
          return prevCart;
        });
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, []);

  const addToCart = async (newProduct) => {
    setCart((prevCart) => ({
      ...prevCart,
      products: [...prevCart.products, newProduct],
    }));
  };

  const removeFromCart = async (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      products: prevCart.products.filter(
        (product) => product._id !== productId
      ),
    }));
  };

  const removeOneFromCart = (productId) => {
    setCart((prevCart) => {
      const productIndex = prevCart.products.findIndex(
        (product) => product._id === productId
      );

      if (productIndex !== -1) {
        // Create a new array without the item to be removed
        const updatedProducts = [
          ...prevCart.products.slice(0, productIndex),
          ...prevCart.products.slice(productIndex + 1),
        ];

        return {
          ...prevCart,
          products: updatedProducts,
        };
      }

      return prevCart;
    });
  };

  const clearCart = () => {
    setCart({
      products: [],
      customer: null,
    });
  };

  const setCustomer = (newCustomer) => {
    setCart((prevCart) => ({
      ...prevCart,
      customer: newCustomer,
    }));
  };

  const removeCustomer = () => {
    setCart((prevCart) => ({
      ...prevCart,
      customer: null,
    }));
  };

  const HoldCart = () => {
    // Save cart to local storage using a dynamic key based on the current timestamp
    localStorage.setItem(cartKey, JSON.stringify(cart));
    clearCart();
  };

  const getCart = (key) => {
    // Retrieve cart from local storage using the same dynamic key
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || {
      products: [],
      customer: null,
    };
    setCart(storedCart);
  };

  const getAllCartsFromLocalStorage = () => {
    const allCarts = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Check if the key starts with 'userCart' and has a valid pattern
      if (
        key &&
        key.startsWith("posCart") &&
        /^posCart_\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(key)
      ) {
        const cart = JSON.parse(localStorage.getItem(key));
        allCarts.push({ key, cart });
      }
    }

    return allCarts;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        setCustomer,
        removeCustomer,
        addToCart,
        removeFromCart,
        removeOneFromCart,
        clearCart,
        HoldCart,
        getCart,
        getAllCartsFromLocalStorage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
