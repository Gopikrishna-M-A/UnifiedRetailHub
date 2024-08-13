"use client";
import React, { forwardRef } from 'react';
import { QRCode } from "antd";
import html2canvas from "html2canvas"; // Import html2canvas library
import { saveAs } from "file-saver"; // Import file-saver library

const UpiId = process.env.NEXT_PUBLIC_UPI_ID;
const UpiName = process.env.NEXT_PUBLIC_UPI_NAME;

const Bill = ({ order },ref) => {

  const billRef = useRef(null);

  // useEffect(() => {
    
  //   const downloadBillAsImage = () => {
  //     if (!billRef.current) return;
    
  //     html2canvas(billRef.current).then((canvas) => {
  //       // Convert the canvas to a Blob
  //       canvas.toBlob((blob) => {
  //         saveAs(blob, `bill ${order.orderNumber}.png`);
  //       });
  //     });
  //   };
    
  //   downloadBillAsImage();
  
  // }, []);


  const getTime = () => {
    const currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero if minutes < 10
    const currentTime = hours + ":" + minutes + " " + ampm;
    return currentTime;
  };

  return (
    <div className="supermarket-bill"  ref={ref}>
      {/* Store Information */}
      <div className="store-info">
        <h3>Maliakkal Stores</h3>
        <p>286Q+644, Padamughal,<br /> Kochi, Kakkanad, Kerala 682037</p>
        <p>+91 1234567890</p>
      </div>

      <h2>Order Summary</h2>

      {/* Transaction Information */}
      <div className="transaction-info">
        <p>{order?.customer?.name}</p>
        <p>Ph: {order?.customer?.phone}</p>
        <p>Order {order?.orderNumber}</p>
        <div className="flex w-full justify-between">
        <p>Date: {new Date().toISOString().split("T")[0].split("-").reverse().join("-")}</p>
        <p>Time: {getTime()}</p>
        </div>
      </div>

      <div className="dot-line"></div>

      <table className="invoice-table">
        <thead className="invoice-head">
          <tr>
            <th style={{ textAlign: "left" }}>Item</th>
            <th style={{ textAlign: "left" }}>Rate</th>
            <th style={{ textAlign: "left" }}>Qty</th>
            <th style={{ textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody className="invoice-body">
          {order?.products?.map((row, index) => (
            <tr key={index}>
              <td>{row.product?.name}</td>
              <td>{row?.price?.toFixed(2)}</td>
              <td style={{ textAlign: "center" }}>{row.quantity}</td>
              <td style={{ textAlign: "right" }}>
                {(row.price * row.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dot-line"></div>

      <div className="invoice-total">
        <div className="invoice-total-tag">TOTAL</div>
        <div className="invoice-total-price">₹ {order?.totalAmount}</div>
      </div>

      <div className="dot-line"></div>

      <div className="footer-info">
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Thank you for shopping with us!
        </p>
      </div>
      <div className="flex flex-col w-full justify-center items-center gap-2">
        <QRCode
          value={
            `upi://pay?pa=${UpiId}&pn=${UpiName}&am=${order?.totalAmount}&cu=INR` ||
            "-"
          }
        />
          <p className="text-center mb-2">Scan to Pay</p>
      </div>
    </div>
  );
};

export default Bill;





