import React, { useState } from "react";
import { Button } from "@/components/ui/button"


const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const truncatedDescription = product.description.length > 30
    ? `${product.description.slice(0, 60)}...`
    : product.description;

  const uppdateWishlist =  () => {
    setIsWishlisted(!isWishlisted);
  }




  return (
    <div className="cursor-pointer w-36 h-fit border rounded-md p-2 relative flex-col gap-1  ">
      <div className="w-full flex justify-center items-center ">
        <img className="w-full" src={`/images/Products/${product.images[0]}`} alt="" />
      </div>
      <div className="flex items-start bg-zinc-200  dark:bg-gray-900  dark:bg-opacity-90 justify-between min-h-12 absolute bottom-0 left-0 right-0 bg-opacity-50 px-2 py-1">
        <div className="text-sm line-clamp-2">{product.name}</div>
      </div>
    </div>
  );
};

export default ProductCard;
