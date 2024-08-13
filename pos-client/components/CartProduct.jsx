import React from "react";

const CartProduct = ({ product, index }) => {
    const formatPrice = (price) => {
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(price);
        return formattedPrice;
      };
    
  return (
    <div className="border-b w-full p-5 flex gap-3 ">
        <div>
            {index + 1}
        </div>
      <div className="flex flex-col w-full">
        <div className="flex items-start justify-between text-sm">
          <div className="flex gap-3 w-2/3">
            <div>{product.product.name}</div>
          </div>
          <div className="flex gap-10">
            <div>x {product.quantity}</div>
            <div>{formatPrice(product.product.currentPrice * product.quantity)}</div>
          </div>
        </div>

        <div className="text-xs">{formatPrice(product.product.basePrice)} | SKU:{product.product.SKU  } | Tax</div>

        <div className="text-xs">Exempt</div>
      </div>
    </div>
  );
};

export default CartProduct;
