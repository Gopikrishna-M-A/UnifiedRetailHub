import Order from '../models/orders.js'
import razorpay from 'razorpay';
import crypto from 'crypto'

// function generateOrderNumber(orderId) {
//   const hash = crypto.createHash('md5').update(orderId.toString()).digest('hex');
//   const numericHash = parseInt(hash.slice(0, 6), 16);
//   const sixDigitNumber = numericHash % 1000000; // Ensure it's a 6-digit number
//   return sixDigitNumber.toString().padStart(6, '0');
// }


function generateOrderNumber() {
  // Function to generate a random hex digit
  function getRandomHexDigit() {
    const hexDigits = "0123456789abcdef";
    return hexDigits[Math.floor(Math.random() * 16)];
  }

  // Function to generate a random alphanumeric character
  function getRandomAlphanumericCharacter() {
    const characters = "0123456789abcdef";
    return characters[Math.floor(Math.random() * characters.length)];
  }

  // Generate the random color string using crypto for enhanced randomness
  const randomBytes = crypto.randomBytes(3);
  const colorString = `#${randomBytes.toString('hex')}`;

  return colorString;
}

const razorpayClient = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer').populate('products.product').sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   

export const verifyOrder = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, total, customer, products, shippingAddress } = req.body;

  try {
      // Fetch payment details from Razorpay
      const payment = await razorpayClient.payments.fetch(razorpay_payment_id);
      const { status, amount, currency, order_id, method } = payment;

      // Verify payment details 
      const result = (status === 'captured' && amount == total && currency === 'INR' && order_id === razorpay_order_id) 

    // const result = razorpayClient.orders.verify(attributes);
    console.log('Payment verification status:', result);
    if (result) {
      const totalPrice = total/100 
      console.log();
      const orderNumber = generateOrderNumber();
      console.log("orderNumber",orderNumber);
      const newOrder = new Order({
        customer,
        products,
        totalAmount:totalPrice,
        shippingAddress,
        paymentStatus:status,
        paymentId:razorpay_payment_id,
        OrderId:order_id,
        signature:razorpay_signature,
        method,
        orderNumber,
        orderStatus:[{status:"Processing",timestamp:Date.now()}]
      });
      const savedOrder = await newOrder.save();

      res.status(200).json({ success: true, message: 'Payment successful', order: savedOrder });
    } else {
      // Invalid payment
      res.status(400).json({ success: false, message: 'Invalid payment' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const createPosOrder = async (req, res) => {
  try {
    const { customer, products, totalAmount, shippingAddress, paymentStatus, method, DeliverType } = req.body;
    const orderNumber = generateOrderNumber();
    const newOrder = new Order({
      customer,
      products,
      totalAmount,
      shippingAddress,
      paymentStatus,
      orderNumber,
      method,
      orderStatus:[{status:"Completed",timestamp:Date.now()}],
      orderSource: "pos",
      DeliverType
    });
    const savedOrder = await newOrder.save()
    const populatedOrder = await Order.findById(savedOrder._id).populate('products.product').populate('customer')
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}


export const statusUpdate = async (req, res) => {
 
  const orderDescMapping = {
    "Processing": "Your order is confirmed and in processing. Thank you for your patience.",
    "Packed": "All items are packed and ready for dispatch. Your order is prepared with care.",
    "Shipped": "Your package is on its way! It has been dispatched from our store.",
    "Delivered": "Package successfully delivered to your address. Enjoy your purchase!",
    "Completed": "Congratulations! Your order is successfully completed. Thank you for choosing us!",
    "Cancelled": "Regrettably, your order has been cancelled. Contact support for assistance.",
    "Refunded": "Good news! Your order has been refunded. Expect the amount in your account soon.",
  };
  try {
    const orderId = req.params.orderId;
    const newStatus = req.body.status; // Assuming you send the new status in the request body

    // Find the order by ID
    const order = await Order.findById(orderId).populate('products.product').populate('customer')

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Add the new status to the orderStatus array

    order.orderStatus.push({
      status: newStatus,
      timestamp: new Date(),
      desc: orderDescMapping[newStatus]
    });

    // Save the updated order
    await order.save();


    res.status(200).json({ message: 'New status added successfully', order });
  } catch (error) {
    console.error('Error adding status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const statusRemove = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID
    const order = await Order.findById(orderId).populate('products.product').populate('customer')

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Add the new status to the orderStatus array
    order.orderStatus.pop();

    // Save the updated order
    await order.save();


    res.status(200).json({ message: 'status removed successfully', order });
  } catch (error) {
    console.error('Error removing status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



export const createOrder = async (req, res) => {
  // console.log("inside create order");
  try {
    const { amount } = req.body;
    const order = await razorpayClient.orders.create({
      amount: amount * 100, // Razorpay amount is in paisa, not rupees
      currency: 'INR',
    });
    res.json({ order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('products.product').populate('customer')
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   




export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    // Update the order status based on the status provided
    // Implement the necessary logic to update the order

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}  




export const getOrderHistory = async (req, res) => {
  console.log("helo inside history ");
  try {
    const userId = req.params.userId; 
    const orderHistory = await Order.find({ customer: userId });
    console.log("orderHistory",orderHistory);
    console.log("userId",userId);
    res.json(orderHistory);
  } catch (error) {
    console.error('Error getting order history:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   


