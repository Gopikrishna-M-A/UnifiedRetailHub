import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Product from "@/services/models/Product"

export async function POST(request) {
  try {
    const products = await Product.find({})
    let updatedCount = 0

    for (const product of products) {
       
      product.currentPrice = 0
      await product.save()
      updatedCount++
    }

    return NextResponse.json({
      message: `Successfully updated ${updatedCount} products.`,
    })
  } catch (error) {
    console.log("update err #### ", error)

    return NextResponse.json(
      { error: "Failed to update products" },
      { status: 500 }
    )
  }
}
