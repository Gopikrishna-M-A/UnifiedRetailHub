import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Vendor from "@/services/models/Vendor"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const page = parseInt(searchParams.get("page")) || 1
  const limit = parseInt(searchParams.get("limit")) || 10

  if (id) {
    try {
      const vendor = await Vendor.findById(id)
      return NextResponse.json(vendor)
    } catch (error) {
      console.error("Failed to fetch Vendor:", error)
      return NextResponse.json(
        { error: "Failed to fetch Vendor" },
        { status: 500 }
      )
    }
  }

  try {
    const skip = (page - 1) * limit
    const totalVendors = await Vendor.countDocuments()
    const totalPages = Math.ceil(totalVendors / limit)

    const vendors = await Vendor.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)

    return NextResponse.json({
      vendors,
      currentPage: page,
      totalPages,
      totalVendors
    })
  } catch (error) {
    console.error("Failed to fetch vendors:", error)
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    // Validate that the necessary fields are present
    // if (!body.name || !body.contact || !body.address) {
    //   return NextResponse.json(
    //     { error: "Name, contact, and address are required" },
    //     { status: 400 }
    //   )
    // }

    // Create a new Vendor instance
    const newVendor = new Vendor(body)

    // Save the Vendor to the database
    await newVendor.save()

    return NextResponse.json(
      { message: "Vendor created successfully", Vendor: newVendor },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create Vendor:", error)
    return NextResponse.json(
      { error: "Failed to create Vendor" },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Vendor ID is required" },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()

    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!updatedVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json(updatedVendor)
  } catch (error) {
    console.error("Failed to update Vendor:", error)
    return NextResponse.json(
      { error: "Failed to update Vendor" },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Vendor ID is required" },
      { status: 400 }
    )
  }

  try {
    const deletedVendor = await Vendor.findByIdAndDelete(id)

    if (!deletedVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Vendor deleted successfully" })
  } catch (error) {
    console.error("Failed to delete Vendor:", error)
    return NextResponse.json(
      { error: "Failed to delete Vendor" },
      { status: 500 }
    )
  }
}
