import React from "react";
import { Button, Rate, Typography, Tag, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import axios from "axios";

import { useCart } from '../../contexts/cartContext';

const { Title, Text, Paragraph } = Typography;

const WishlistCard = ({ product }) => {
  const { addToCart } = useCart();
  const { push } = useRouter();
  
  const handleCart = async() => {
    if (!user) {
      push(`/api/auth/signin?callbackUrl=/products/${category}`);
    }else{
      addToCart(product._id, user._id, 1);
    }
  }

  const truncatedDescription = product.description.length > 30
    ? `${product.description.slice(0, 60)}...`
    : product.description;

  return (
    <div className="w-80 border rounded-md p-2.5 relative flex-col gap-1">
      <HeartOutlined className="absolute top-5 right-5 cursor-pointer "/>
      {/* <HeartFilled className="whishlist-icon"/> */}
      <div className="w-full flex justify-center items-center ">
        <img className="w-3/6" src={`/images/Products/${product.images[0]}`} alt="" />
      </div>
      <div className="flex items-center justify-between">
        <Link href={`/product/${product._id}`}><Title  level={5}>{product.name}</Title></Link>
        <Text className="text-nowrap" type="secondary">{product.attributes.weight || product.attributes.size}</Text>
      </div>
      <div className="flex gap-1">
        <Paragraph>{truncatedDescription}</Paragraph>
      </div>
      <div className="flex justify-between">
        <Rate value={3} disabled  />
        <div className="text-3xl p-0 w-6 h-6 rounded flex items-center justify-center  bg-green-50 border border-green-600">
          <div className="w-2 h-2 rounded-full bg-green-600"></div>
        </div>
      </div>
      <div className="flex gap-2 items-center ">
        <Text className="font-bold">₹{product.price}</Text>
        <Text type="secondary" delete >
          ₹{(product.price * 1.1).toFixed(2)}
        </Text>
        <Tag bordered={false} color="green">
          10% OFF
        </Tag>
      </div>
      <Button onClick={handleCart}>Add to Cart</Button>
    </div>
  );
};

export default WishlistCard;
