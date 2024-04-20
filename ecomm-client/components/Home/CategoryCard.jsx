import React from "react";
import { Typography, Skeleton } from "antd";
import Link from "next/link";
const { Text } = Typography;

const CategoryCard = ({ category }) => {
  const img = `/images/Categories/${category.name.split(' ')[0].toLowerCase()}.jpg`;
  return (
    <Link href={`/products/${category._id}`}>
      {/* <div className="relative border border-solid rounded-md overflow-hidden flex flex-col items-center justify-between h-40 w-40 cursor-pointer hover:shadow-md">
        <div className="w-full ">
          {img ? (
            <img className=" object-cover rounded-md w-full h-full" src={img} alt="category" />
          ) : (
            <Skeleton.Image active={true} />
          )}
        </div>
        <div className="text-center absolute bottom-0 top-0 left-0 right-0 rounded-md font-bold flex justify-center items-center">
          <Text className=" px-3 rounded text-transparen  bg-clip-text bg-white w-full h-full">{category.name}</Text>
        </div>
      </div> */}  

<div className="relative overflow-hidden border w-40 h-40 rounded-md group">
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-300 transform group-hover:scale-105"
        style={{
          backgroundImage: `url('${img}')`,
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-center text-xl font-bold">{category.name}</p>
      </div>
    </div>
    </Link>
    
  );
};

export default CategoryCard;
<Skeleton active paragraph={{ rows: 1 }} />;
// className=" w-20 lg:w-24"