import { NextResponse } from "next/server"
import Order from "@/services/models/Order"
import mongoose from 'mongoose'


export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const customerId = searchParams.get("customerId")

  if (id) {
    try {
      console.log("order id ###",id);
      
      const order = await Order.findById(id)
        .populate("products.product")
        .populate("customer")
      return NextResponse.json(order)
    } catch (error) {
      console.error("Failed to fetch order details:", error)
      return NextResponse.json(
        { error: "Failed to fetch order details" },
        { status: 500 }
      )
    }
  }

  if(customerId){
    try{
      const orders = await Order.find({customer:customerId})
        .populate("products.product")
        .populate("customer")
        .sort({ orderDate: -1 })
      return NextResponse.json(orders)
    } catch (error) {
      console.error("Failed to fetch order history:", error)
      return NextResponse.json(
        { error: "Failed to fetch order history" },
        { status: 500 }
      )
    }
  }

  try {
    const orders = await Order.find()
      .populate("products.product")
      .populate("customer")
      .sort({ orderDate: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Failed to fetch order history:", error)
    return NextResponse.json(
      { error: "Failed to fetch order history" },
      { status: 500 }
    )
  }
}