import { NextResponse } from "next/server"
import PDFDocument from "pdfkit-browserify"
import QRCode from "qrcode"
import blobStream from "blob-stream"

export async function POST(request) {
  try {
    const {order} = await request.json()
    console.log("order",order);

    const height = 50 * order.products.length + 400
    
    const pdfBuffer = await generateReceipt(order,height)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=receipt.pdf",
      },
    })
  } catch (error) {
    console.error("Failed to create receipt:", error)
    return NextResponse.json(
      { error: "Failed to create receipt" },
      { status: 500 }
    )
  }
}


async function generateReceipt(order,height) {

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [230,height],
      margins: { top: 10, bottom: 10, left: 10, right: 10 },
    })

    const stream = doc.pipe(blobStream())



    // Header
    doc.fontSize(12).text("Maliakkal Stores", { align: "center" })
    doc.fontSize(9).text("11/9 A-1-A Maliakkal VB Park Road,", { align: "center" })
    doc.text("Padamughal, Kakkanad Post, Kochi-682030", { align: "center" })
    doc.text("Phone: 9567254511", { align: "center" })
    doc.text("GST Rule 2017 - TAX INVOICE - CASH", { align: "center" })
    doc.text("GST32ANJPJ0285A1ZK", { align: "left" })
    doc.moveDown(0.5)

    // Order summary
    const currentDate = new Date()
    const formattedDate = `${currentDate.getDate()}/${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    doc
      .fontSize(8)
      .text(`Date: ${formattedDate}   ${formattedTime}   Bill No : 19212`, {
        align: "center",
      })
    doc.moveDown(0.5)

    // Table Header
    const tableTop = doc.y
    const itemX = 10
    const mrpX = 70
    const qtyX = 100
    const rateX = 135
    const amountX = 170
    const totalX = 100
    const itemWidth = 60


    doc.fontSize(8)
    doc.font('Courier-Bold');

    doc.text("Item", itemX, tableTop)
    doc.text("MRP", mrpX, tableTop, { width: 40, align: "right" })
    doc.text("Qty", qtyX, tableTop, { width: 30, align: "right" })
    doc.text("Rate", rateX, tableTop, { width: 40, align: "right" })
    doc.text("Amount", amountX, tableTop, { width: 50, align: "right" })
    doc.moveDown(0.5)

    // Draw a line under the header
    doc.moveTo(itemX, doc.y).lineTo(220, doc.y).stroke()
    doc.moveDown(0.5)

    // Items
    let total = 0
    const itemStartY = doc.y
    let maxY = itemStartY
      
    order.products.forEach((item) => {
      const itemTotal = item.price * item.quantity
      const y = doc.y

      doc.fontSize(9)

      const itemNameHeight = doc.heightOfString(item.product.name, { width: itemWidth })
      doc.text(item.product.name, itemX, y, { width: itemWidth, align: 'left' })


      doc.text(`${item.product.basePrice.toFixed(2)}`, mrpX, y, {
        width: 40,
        align: "right",
      })
  
      doc.text(item.quantity.toString(), qtyX, y, { width: 30, align: "right" })
      doc.text(`${item.price.toFixed(2)}`, rateX, y, {
        width: 40,
        align: "right",
      })
      doc.text(`${itemTotal.toFixed(2)}`, amountX, y, {
        width: 50,
        align: "right",
      })

      total += itemTotal
      maxY = Math.max(maxY, y + itemNameHeight)
      doc.y = maxY
      doc.moveDown(0.5)
    })

    // Total
    doc.moveTo(itemX, doc.y).lineTo(220, doc.y).stroke()
    doc.moveDown(0.5)
    doc.fontSize(20).text("TOTAL:", itemX, doc.y+12 )
    doc.text(`${total.toFixed(2)}`, totalX, doc.y - 20, {
      align: "right",
    })

    // Reset x-position for footer
    doc.x = 10

    // Footer with QR Code
    doc.moveDown(1)
    doc.fontSize(9).text("Thank you for shopping with us!", { align: "center" })
    doc.moveDown(0.5)

    const qrText = "Your QR code content here"
    QRCode.toDataURL(qrText, { errorCorrectionLevel: "H" }, (err, url) => {
      if (err) {
        console.error("Failed to generate QR code:", err)
        doc.end()
      } else {
        doc.image(url, (230 - 100) / 2, doc.y, { fit: [100, 100] }) // Centered QR code
        doc.moveDown(-0.4)
        doc.fontSize(9).text("Scan to Pay", { align: "center" })
        const pageHeight = doc.y + 20 
        doc.page.height = pageHeight
        doc.end()
      }
    })
 
    stream.on("finish", () => {
      const pdfBlob = stream.toBlob("application/pdf")
      resolve(pdfBlob)
    })
  })
}
