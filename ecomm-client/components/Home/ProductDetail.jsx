"use client";
import { useState, useEffect } from "react";
import { Image, Typography, Rate, Button, Tag, InputNumber, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useCart } from '../../contexts/cartContext';
import { useSession } from "next-auth/react";

const { Text, Title } = Typography;

const Products = ({ product }) => {
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)

  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [currentImage, setCurrentImage] = useState(1);

  const handleCart = async() => {
    if (!user) {
      push(`/api/auth/signin?callbackUrl=/products/${category}`);
    }else{
      addToCart(product._id, user._id, qty);
    }
  }
  const images = {};

  for (let i = 0; i < product?.images?.length; i++) {
    images[`image${i + 1}`] = `/images/Products/${product.images[i]}`;
  }


  return (
    <div className="px-10 py-2.5 flex gap-1 ">
      <div className="w-full my-2.5 flex gap-1">
        <div className=" w-2/5 p-12 border-r flex-col">
          <div className="flex">
            <div>
              <Image
                preview={false}
                src={images[`image${currentImage}`]}
                width={400}
                height={400}
              />
            </div>
            <div className="flex-col">
            {images.image1 && (
              <Image
                className="border rounded p-1"
                preview={false}
                width={50}
                src={images.image1}
                onClick={() => setCurrentImage(1)}
              />
            )}
            {images.image2 && (
              <Image
                className="border rounded p-1"
                preview={false}
                width={50}
                src={images.image2}
                onClick={() => setCurrentImage(2)}
              />
            )}

            {images.image3 && (
              <Image
                className="border rounded p-1"
                preview={false}
                width={50}
                src={images.image3}
                onClick={() => setCurrentImage(3)}

              />
            )}

            {images.image4 && (
              <Image
                className="border rounded p-1"
                preview={false}
                width={50}
                src={images.image4}
                onClick={() => setCurrentImage(4)}

              />
            )}
            </div>
          </div>
        </div>

        <div className=" w-2/5 flex-col justify-between flex gap-5 ml-12">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Title level={1}>{product?.name}</Title>
            </div>
            <div className="flex gap-2">
              <Text>{product?.description}</Text>
            </div>
            <div className="flex gap-2">
            {Object.entries(product?.attributes || {}).map(([key, value]) => (
                <Tag key={key} bordered={false} >
                    {`${value}`}
                </Tag>
                ))}
            </div>
            <div className="flex items-center gap-2">
              <Title level={2}>₹{product?.price}</Title>
              <Text type="secondary" delete>
                ₹{(product?.price * 1.1).toFixed(2)}
              </Text>
              <Tag bordered={false} color="green">
                10% OFF
              </Tag>
            </div>
            <div className="flex items-center gap-2">
              <Text>Quantity</Text>
              <InputNumber
              
                placeholder="Qty"
                value={qty}
                onChange={(value) => setQty(value)}
                min={1}
                max={10}
              />
            </div>
            <div className="flex">
              <Rate value={3} disabled />
              <Text>441 reviews </Text>
            </div>
            <div className="flex gap-2">
                <Button size="large" onClick={handleCart}>Add to Cart</Button>
              <Link href={"/cart"}>
              <Button size="large" type="primary" onClick={handleCart}>
                Buy Now
              </Button>
              </Link>

            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between w-full gap-2">
              <Text type="secondary">Recently viewed</Text>
              <div className="flex items-start gap-2">
                <Button shape="circle" icon={<LeftOutlined />}></Button>
                <Button shape="circle" icon={<RightOutlined />}></Button>
              </div>
            </div>
            <div className="flex gap-5">
              <Image
                className="border rounded p-2.5 object-contain"
                preview={false}
                height={100}
                width={120}
                src="/images/Products/orange.jpeg"
              />
              <Image
                className="border rounded p-2.5 object-contain"
                preview={false}
                height={100}
                width={120}
                src="/images/Products/kiwi.jpeg"
              />
              <Image
                className="border rounded p-2.5 object-contain"
                preview={false}
                height={100}
                width={120}
                src="/images/Products/berry.jpeg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
