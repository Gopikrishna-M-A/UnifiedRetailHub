import { Separator } from "../ui/separator"


const PriceDetails = ({ products, order }) => {


    const calculateTotalPrice = (quantity, price) => quantity * price;

    const priceDetails = products?.map((cartItem) => (
        <div key={cartItem?.product?._id} className="flex justify-between text-sm text-muted-foreground">
          <p style={{width:"70%"}} type="secondary">{`${cartItem?.quantity} x ${cartItem?.product?.name}`}</p>
          <p>{`₹${calculateTotalPrice(cartItem?.quantity, cartItem?.product?.sellingPrice).toFixed(2)}`}</p>
        </div>
      ));
    const totalAmount = products?.reduce(
        (total, cartItem) => total + calculateTotalPrice(cartItem?.quantity, cartItem?.product?.sellingPrice),
        0
    );
    const couponDiscount = totalAmount > 25 ? 10 : 0 // Assuming a fixed coupon discount for this example
    const deliveryCharges = 0; // Assuming free delivery for this example
    const cartTotal = ((totalAmount + deliveryCharges) - couponDiscount ).toFixed(2);

    const addressObject = order?.shippingAddress
    const addressString = `${addressObject?.street}, ${addressObject?.city}, ${addressObject?.state} ${addressObject.zipCode}, ${addressObject.country}`;



  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="text-sm">{`${products?.length} items`}</p>
        {priceDetails}
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">Discount</p>
          <p className="text-sm">{`-₹${couponDiscount}`}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">Delivery Charges</p>
          <p className="text-sm">{deliveryCharges === 0 ? 'Free Delivery' : `₹${deliveryCharges}`}</p>
        </div>
        <Separator style={{ margin: 5 }} />
        <div className="flex justify-between">
          <div className="font-bold">Total Amount</div>
          <div className="font-bold">{`₹${(totalAmount - couponDiscount).toFixed(2)}`}</div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-md p-2 text-sm">
        <div className="flex flex-col text-muted-foreground">
        <div className="font-bold">{order.customer.name}</div>
        <div>{addressString}</div>
        <div>{order.customer.email}</div>
        <div>{order.customer.phone}</div>
        </div>
      </div>
    </div>
  )
}

export default PriceDetails
