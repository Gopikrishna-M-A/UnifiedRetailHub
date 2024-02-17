"use client";
import React, { useState } from "react";
import { List, Button, Card, Modal, Space, Typography } from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import WishlistCard from "../../components/Wishlist/WishlistCard";
import { useWishlist } from "@/contexts/wishlistContext";

const { confirm } = Modal;
const { Text, Title, Paragraph } = Typography;

const Wishlist = () => {
  const { wishlist } = useWishlist();


  const handleRemoveItem = (itemId) => {
    confirm({
      title: "Remove from Wishlist",
      content: "Are you sure you want to remove this item from your wishlist?",
      onOk() {
        const updatedItems = wishlistItems.filter((item) => item.id !== itemId);
        setWishlistItems(updatedItems);
      },
      onCancel() {},
    });
  };

  const handleAddToCart = (itemId) => {
    // Implement your logic to add the item to the cart
    console.log(`Add to cart clicked for item with ID ${itemId}`);
  };

  return (
    <div className="px-5 py-5">
      <Title level={3}>Wishlist</Title>
      <div className="flex flex-wrap gap-5 mt-5">
        {wishlist?.map((item) => (
          <WishlistCard product={item} handleRemoveItem={handleRemoveItem} handleAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
