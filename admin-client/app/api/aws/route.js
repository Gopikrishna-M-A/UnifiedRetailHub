import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";



const generateUniqueFileName = (originalFileName) => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, ''); // Remove non-numeric characters from timestamp
  const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
  const fileExtension = originalFileName.split('.').pop(); // Get file extension
  return `${timestamp}_${randomString}.${fileExtension}`;
}


const Bucket = process.env.AWS_BUCKET_NAME;

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  return NextResponse.json(response?.Contents ?? []);
}

// endpoint to upload a file to the bucket
export async function POST(request) {
  const formData = await request.formData();
  const files = formData.getAll("file");

  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const uniqueFileName = generateUniqueFileName(file.name);
      const Body = (await file.arrayBuffer());
      s3.send(new PutObjectCommand({ Bucket, Key: uniqueFileName, Body }));
      return `https://${Bucket}.s3.amazonaws.com/${uniqueFileName}`;
    })
  );

  return NextResponse.json(uploadedFiles);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: "File key is required" }, { status: 400 });
  }

  try {
    await s3.send(new DeleteObjectCommand({ Bucket, Key: key }));
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}



// https://<bucker-name>.s3.<region>.amazonaws.com/<filename>