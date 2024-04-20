import React from "react";
// import Image from "next/image";
import { Typography, Image } from "antd";
const { Text } = Typography;

const OrderItems = ({ products }) => {
  return (
    <div className="flex flex-col mt-5 gap-2">
      {products.map((product) => (
        <div key={product._id} className="flex gap-3">
          <div>
            <Image
              preview={false}
              alt="Product Image"
              width={70}
              height={70}
              src={product.product.images[0]}
            />
          </div>
          <div>
            <div>
              <Text strong>{product.product.name}</Text>
              <br />
              <Text type="secondary">
                {product.product.description.length > 30
                  ? `${product.product.description.slice(0, 30)}...`
                  : product.product.description}
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <Text strong>₹{product.price}</Text>
              <Text type="secondary">{product.quantity} item</Text>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
