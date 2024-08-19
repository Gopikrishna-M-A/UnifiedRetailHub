import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Product from "@/services/models/Product"
import dbConnect from "@/services/db"


export async function GET(request) {
  await dbConnect()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const page = parseInt(searchParams.get("page")) || 1
  const limit = parseInt(searchParams.get("limit")) || 10

  if (id) {
    try {
      const product = await Product.findById(id).populate("category")
      return NextResponse.json(product)
    } catch (error) {
      console.error("Failed to fetch product:", error)
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 500 }
      )
    }
  }

  try {
    const totalProducts = await Product.countDocuments()

    // Check if the limit is set to fetch all products
    const fetchAllProducts = limit === -1 // You can choose any specific value, like -1

    let products;
    let totalPages;

    if (fetchAllProducts) {
      products = await Product.find().populate("category").sort({ _id: -1 })
      totalPages = 1
    } else {
      const skip = (page - 1) * limit
      totalPages = Math.ceil(totalProducts / limit)

      products = await Product.find()
        .populate("category")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    }

    return NextResponse.json({
      products,
      currentPage: fetchAllProducts ? 1 : page,
      totalPages,
      totalProducts
    })
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
