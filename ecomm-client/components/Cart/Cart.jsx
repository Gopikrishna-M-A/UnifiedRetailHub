import { Checkbox, Typography, Empty } from "antd";
import CartItem from "./CartItem";
import Coupoun from "./Coupoun";
import Gifting from "./Gifting";
import PriceDetails from "./PriceDetails";
import { useCart } from '../../contexts/cartContext';

const { Text } = Typography;




const Cart = ({ setCurrent }) => {
  const { cart } = useCart();

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <div className=" my-2.5 flex gap-12 justify-center">
      <div className="w-1/2 flex flex-col gap-2">
        <div className="flex mb-2.4 justify-between ">
          <div className="flex gap-2">
            <Checkbox checked onChange={onChange} />
            <Text>
              {cart?.products?.length}/{cart?.products?.length} items selected
            </Text>
          </div>

          <div className="flex gap-2">
            <Text>Move to wishlist</Text>
            <Text type="secondary">Remove</Text>
          </div>
        </div>

        <div className="border rounded-md px-5 py-1 ">
          {cart?.products && cart?.products?.length > 0 ? (
            cart?.products?.map((cartItem,index) => (
              <CartItem
                index={index == cart?.products?.length - 1 ? true : false} 
                key={cartItem._id}
                cartItem={cartItem}
              />
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No items in the cart"/>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-5 w-[350px]">
        {/* <Coupoun /> */}
        {/* <Gifting /> */}
        {cart?.products?.length > 0 && <PriceDetails setCurrent={setCurrent}/> }
      </div>
    </div>
  );
};

export default Cart;
