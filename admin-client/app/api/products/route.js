import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Product from "@/services/models/Product"
import {
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.AWS_BUCKET_NAME;

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


export async function GET(request) {
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

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate that the necessary fields are present
    if (!body.name || !body.basePrice || !body.category) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      )
    }

    // Create a new product instance
    const newProduct = new Product(body)

    // Save the product to the database
    await newProduct.save()

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    )
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl.includes("s3.amazonaws.com")) {
          const key = imageUrl.split("/").pop();
          try {
            await s3.send(new DeleteObjectCommand({ Bucket, Key: key }));
          } catch (error) {
            console.error(`Failed to delete image ${key} from S3:`, error);
            // Continue with deletion of other images and the product itself
          }
        }
      }
    }

    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
