import { NextResponse } from "next/server"
import Order from "@/services/models/Order"
import mongoose from 'mongoose'


const orderDescMapping = {
    Processing:
      "Your order is confirmed and in processing. Thank you for your patience.",
    Packed:
      "All items are packed and ready for dispatch. Your order is prepared with care.",
    Shipped: "Your package is on its way! It has been dispatched from our store.",
    Delivered:
      "Package successfully delivered to your address. Enjoy your purchase!",
    Completed:
      "Congratulations! Your order is successfully completed. Thank you for choosing us!",
    Cancelled:
      "Regrettably, your order has been cancelled. Contact support for assistance.",
    Refunded:
      "Good news! Your order has been refunded. Expect the amount in your account soon.",
  }



export async function PATCH(request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const { status } = await request.json()
    try {
      const order = await Order.findById(id)
        .populate("products.product")
        .populate("customer")
      if (!order) {
        throw new Error("Order not found")
      }
      order.orderStatus.push({
        status,
        timestamp: new Date(),
        desc: orderDescMapping[status],
      })
      await order.save()
      return NextResponse.json(order)
    } catch (error) {
      console.error("Failed to update order status:", error)
      return NextResponse.json(
        { error: "Failed to update order status" },
        { status: 500 }
      )
    }
  }
  
  export async function DELETE(request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    try {
      const order = await Order.findById(id).populate('products.product').populate('customer');
      if (!order) {
          throw new Error('Order not found');
      }
      order.orderStatus.pop();
      await order.save();
  
      return NextResponse.json(order)
    } catch (error) {
      console.error("Failed to remove order status:", error)
      return NextResponse.json(
        { error: "Failed to remove order status" },
        { status: 500 }
      )
    }
  }
  