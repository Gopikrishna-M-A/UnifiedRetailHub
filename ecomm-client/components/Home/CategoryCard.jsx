import React from "react";
import { Typography, Skeleton } from "antd";
import Link from "next/link";
const { Text } = Typography;

const CategoryCard = ({ category }) => {
  const img = "/images/Categories/fruirtsandveg.png";
  return (
    <Link href={`/products/${category._id}`}>
      <div className="border border-solid border-gray-300 rounded-md flex flex-col items-center justify-between p-5 h-44 w-40 cursor-pointer hover:shadow-md">
        <div className=" w-20 lg:w-24">
          {img ? (
            <img src={img} alt="category" />
          ) : (
            <Skeleton.Image active={true} />
          )}
        </div>
        <div className="text-center w-9/12">
          <Text>{category.name}</Text>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
<Skeleton active paragraph={{ rows: 1 }} />;
