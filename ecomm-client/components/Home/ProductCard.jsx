import React, { useEffect, useState } from "react";
import { Button, Rate, Typography, Tag, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "../../contexts/cartContext";
import { useSession } from "next-auth/react";
import { useWishlist } from "@/contexts/wishlistContext";

const { Title, Text, Paragraph } = Typography;

const ProductCard = ({ product }) => {
  // console.log("pro",product);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { push } = useRouter();

  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);

  useEffect(() => {
    const isProductIdExists = wishlist.some((item) => item._id === product._id);
    setIsWishlisted(isProductIdExists);
  }, [wishlist, product._id]);

  const handleCart = async () => {
    if (!user) {
      push(`/api/auth/signin?callbackUrl=/products/${product.category._id}`);
    } else {
      addToCart(product._id, user._id, 1);
    }
  };

  const truncatedDescription =
    product.description.length > 30
      ? `${product.description.slice(0, 60)}...`
      : product.description;

  const uppdateWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  function lower(name) {
    if (name.length === 0) {
      return name;
    }
    return name.toLowerCase();
  }

  return (
    <div className="w-80 border rounded-md p-2.5 relative flex-col gap-1 ">
      {isWishlisted ? (
        <HeartFilled
          onClick={uppdateWishlist}
          className="absolute top-5 right-5 cursor-pointer"
        />
      ) : (
        <HeartOutlined
          onClick={uppdateWishlist}
          className="absolute top-5 right-5 cursor-pointer"
        />
      )}

      
      <Link href={`/product/${product._id}`}>
        <div className="w-full flex justify-center items-center min-h-40">
          {product.images[0] ? (
            <img className="w-3/6" src={`${product.images[0]}`} alt="" />
          ) : (
            <img
              className="w-3/6"
              src={`/images/Products/placeholder.png`}
              alt=""
            />
          )}
        </div>
      </Link>

      <div>
        <div className="flex items-start justify-between gap-5">
          <Link href={`/product/${product._id}`}>
            <div className=" capitalize"> {lower(product.name)}</div>
          </Link>
          <Text className="text-nowrap" type="secondary">
            {product?.weight?.value}gm
          </Text>
        </div>
        <div className="flex gap-1">
          <Paragraph>{truncatedDescription}</Paragraph>
        </div>
        <div className="flex justify-between mt-2">
          <Rate value={3} disabled />
          <div className="text-3xl p-0 w-6 h-6 rounded flex items-center justify-center  bg-green-50 border border-green-600">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
          </div>
        </div>
        <div className="flex gap-2 items-center ">
          <Text className="font-bold">₹{product.sellingPrice}</Text>
          <Text type="secondary" delete>
            ₹{(product.sellingPrice * 1.1).toFixed(2)}
          </Text>
          <Tag bordered={false} color="green">
            10% OFF
          </Tag>
        </div>
        <Button onClick={handleCart}>Add to Cart</Button>
      </div>
    </div>
  );
};

export default ProductCard;
