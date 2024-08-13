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