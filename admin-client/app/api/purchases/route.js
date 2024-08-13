import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Purchase from "@/services/models/Purchase"


export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const page = parseInt(searchParams.get("page")) || 1
  const limit = parseInt(searchParams.get("limit")) || 10

  if (id) {
    try {
      const purchase = await Purchase.findById(id)
      return NextResponse.json(purchase)
    } catch (error) {
      console.error("Failed to fetch Purchase:", error)
      return NextResponse.json(
        { error: "Failed to fetch Purchase" },
        { status: 500 }
      )
    }
  }

  try {
    const skip = (page - 1) * limit
    const totalPurchases = await Purchase.countDocuments()
    const totalPages = Math.ceil(totalPurchases / limit)

    const purchases = await Purchase.find()
      .populate('vendor')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)

    return NextResponse.json({
      purchases,
      currentPage: page,
      totalPages,
      totalPurchases
    })
  } catch (error) {
    console.error("Failed to fetch purchases:", error)
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    // Validate that the necessary fields are present
    // if (!body.name || !body.basePrice || !body.category) {
    //   return NextResponse.json(
    //     { error: "Name, price, and category are required" },
    //     { status: 400 }
    //   )
    // }

    // Create a new Purchase instance
    const newPurchase = new Purchase(body)

    // Save the Purchase to the database
    await newPurchase.save()

    return NextResponse.json(
      { message: "Purchase created successfully", Purchase: newPurchase },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create Purchase:", error)
    return NextResponse.json(
      { error: "Failed to create Purchase" },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Purchase ID is required" },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()

    const updatedProduct = await Purchase.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Failed to update Purchase:", error)
    return NextResponse.json(
      { error: "Failed to update Purchase" },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Purchase ID is required" },
      { status: 400 }
    )
  }

  try {
  
    const deletedPurchase = await Purchase.findByIdAndDelete(id)

    if (!deletedPurchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Purchase deleted successfully" })
  } catch (error) {
    console.error("Failed to delete Purchase:", error)
    return NextResponse.json(
      { error: "Failed to delete Purchase" },
      { status: 500 }
    )
  }
}
