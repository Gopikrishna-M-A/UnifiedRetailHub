"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCartOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Typography, Input, Select, Badge } from "antd";

import { useSession, signIn, signOut } from "next-auth/react"

import { useCart } from "../../contexts/cartContext";
import { useWishlist } from "@/contexts/wishlistContext";

const { Title, Text } = Typography;
const { Search } = Input;

const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const cartQty = cart?.products?.reduce(
    (acc, product) => acc + product.quantity,
    0
  );
  const wishlistQty = wishlist?.length;

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };
  const closeNav = () => {
    setIsNavExpanded(false);
  };

  const handleMenuClick = async (e) => {
    if (e.key === "1") {
    } else if (e.key === "2") {
    }
  };


  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value, _e, info) => {
    console.log(info?.source, value);
  };

  const items = [
    {
      key: '1',
      label: (
        <Link href="/profile" rel="noopener noreferrer" >
          Profile
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link href="/orders" rel="noopener noreferrer" >
          Orders
        </Link>
      ),
    },
    {
      key: '3',
      danger: true,
      label: (
        <div onClick={signOut} rel="noopener noreferrer" >
         Sign out
        </div>
      ),
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-screen flex items-center justify-between p-5 border-b bg-white">
        <Link className="font-bold text-2xl" href="/">
          <div className="bg-sky-600 px-3 py-1 rounded text-white font-bold text-lg">Maliakkal Stores</div>
        </Link>

        <Search
          style={{
            width: "100%",
            maxWidth: "300px",
          }}
          className="search-input hidden lg:block"
          addonBefore={
            <Select
              defaultValue="all-Categories"
              onChange={handleChange}
              options={[
                { value: "all-Categories", label: "All Categories" },
                { value: "electronics", label: "Electronics" },
                { value: "clothing", label: "Clothing" },
                { value: "furniture", label: "Furniture" },
                { value: "books", label: "Books" },
                { value: "toys", label: "Toys" },
                { value: "fruits", label: "Fruits" },
              ]}
            />
          }
          placeholder="I'm searching for..."
          allowClear
          onSearch={onSearch}
        />

        <div className="flex items-center gap-4">
          <div className=" flex gap-8 mr-3">
            <Link className="link-item" onClick={closeNav} href="/cart">
              <Badge count={cartQty}>
                <ShoppingCartOutlined />
              </Badge>
            </Link>
            <Link className="link-item" onClick={closeNav} href="/wishlist">
            <Badge count={wishlistQty}>
              <HeartOutlined />
            </Badge>
            </Link>
          </div>
          {!user && (
              <Button onClick={signIn}>
                Sign in
              </Button>
          )}
          {user &&
          <Dropdown
            menu={{
              items,
            }}
          >
             <img src={user.image} className="cursor-pointer w-9 h-9 rounded-full"></img>
          </Dropdown>
            } 
        </div>
      </nav>
    </>
  );
};

export default Navbar;
