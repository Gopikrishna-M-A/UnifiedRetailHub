
const Bill = ({ order }) => {
  return (
<div className="supermarket-bill text-sm h-fit">

          <h2 className="py-5">Order Summary</h2>

        

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
                  <td>{row?.product?.name}</td>
                  <td>{row?.price}</td>
                  <td style={{ textAlign: "center" }}>{row?.quantity}</td>
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

        </div>
  )
}

export default Bill