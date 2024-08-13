import { NextResponse } from "next/server"
import Order from "@/services/models/Order"
import mongoose from 'mongoose'
import crypto from 'crypto'

function generateOrderNumber() {
  const randomBytes = crypto.randomBytes(3);
  const colorString = `#${randomBytes.toString('hex')}`;
  return colorString;
}


export async function POST(request) {
  try {
    const body = await request.json()
    const orderNumber = generateOrderNumber();

    const newOrder = new Order({
      ...body,
      orderNumber,
      orderStatus:[{status:"Completed",timestamp:Date.now()}],
      orderSource: "pos",
    });

    await newOrder.save()
    const populatedOrder = await Order.findById(newOrder._id).populate('products.product').populate('customer')
    

    return NextResponse.json(populatedOrder)
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}