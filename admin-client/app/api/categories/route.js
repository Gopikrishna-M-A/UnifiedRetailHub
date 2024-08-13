import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Category from "@/services/models/Category"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    try {
      const category = await Category.findById(id)
      return NextResponse.json(category)
    } catch (error) {
      console.error("Failed to fetch category:", error)
      return NextResponse.json(
        { error: "Failed to fetch category" },
        { status: 500 }
      )
    }
  }

  try {
    const categories = await Category.find().sort({ _id: -1 })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const newCategory = new Category(data)
    await newCategory.save()
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Failed to create category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Failed to update category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }
    const deletedCategory = await Category.findByIdAndDelete(id)
    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    return NextResponse.json(deletedCategory)
  } catch (error) {
    console.error("Failed to delete category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
