import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

const Bill = ({ orderID, tableData, total, cartTotal }) => {
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  const [data,setData] = useState(tableData)

  return (
<div className="supermarket-bill">
          {/* Store Information */}
          <div className="store-info">
            <h3>Mart</h3>
            <p>address</p>
            <p>+91 1234567890</p>
          </div>

          <h2>Order Summary</h2>

          {/* Transaction Information */}
          <div className="transaction-info">
            <p>{user.name}</p>
            <p>Ph: {user.phone}</p>
            <p>Order#: {orderID}</p>
            <p>Date: {new Date().toISOString().split("T")[0]}</p>
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
              {data?.map((row, index) => (
                <tr key={index}>
                  <td>{row.item}</td>
                  <td>{row.rate.toFixed(2)}</td>
                  <td style={{ textAlign: "center" }}>{row.qty}</td>
                  <td style={{ textAlign: "right" }}>
                    {(row.rate * row.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="dot-line"></div>

          <div className="invoice-total">
            <div className="invoice-total-tag">TOTAL</div>
            <div className="invoice-total-price">₹ {cartTotal}</div>
          </div>

          <div className="dot-line"></div>

          <div className="footer-info">
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Thank you for shopping with us!
            </p>
          </div>
        </div>
  )
}

export default Bill