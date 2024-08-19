import { NextResponse } from "next/server"
import mongoose from 'mongoose'
import User from "@/services/models/User"
import dbConnect from "@/services/db"

export async function GET(request) {
  await dbConnect()
  try {
    const customers = await User.find()
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Failed to fetch customers:", error)
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
}
