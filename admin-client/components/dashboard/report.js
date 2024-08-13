import { jsPDF } from "jspdf";
import "jspdf-autotable";

function generateCustomerTable(data) {
  let tableData = [];

  // Group orders by customer
  const customerOrders = {};
  data.forEach((order) => {
    const email = order.customer.email;
    if (!customerOrders[email]) {
      customerOrders[email] = [];
    }
    customerOrders[email].push(order);
  });

  // Process each customer
  for (const [email, orders] of Object.entries(customerOrders)) {
    let customerInfo = {};
    let totalSpend = 0;
    let totalProductsPurchased = 0;
    let productsCount = {};
    let favouriteProduct = null;
    let favouriteCategory = null;
    let preferredPaymentType = null;
    let preferredDeliveryType = null;
    let deliveryPreference = null;

    orders.forEach((order) => {
      // Calculate total spend
      totalSpend += order.totalAmount;

      // Calculate total products purchased
      totalProductsPurchased += order.products.length;

      // Calculate favourite product and category
      order.products.forEach((product) => {
        productsCount[product?.product?.name] =
          (productsCount[product?.product?.name] || 0) + product?.quantity;
        if (
          !favouriteProduct ||
          productsCount[product?.product?.name] > productsCount[favouriteProduct]
        ) {
          favouriteProduct = product?.product?.name;
          favouriteCategory = product?.product?.category;
        }
      });

      // Get preferred payment type
      preferredPaymentType = order.method;

      // Get preferred delivery type
      preferredDeliveryType = order.DeliverType;

      // Get delivery preference
      deliveryPreference =
        order.customer.address.city +
        ", " +
        order.customer.address.state +
        ", " +
        order.customer.address.country;
    });

    // Fill customer info
    customerInfo["Name"] = orders[0].customer.name;
    customerInfo["Email"] = email;
    customerInfo["Phone"] = orders[0].customer.phone;
    customerInfo["Location"] = deliveryPreference;
    customerInfo["Total Spend"] = totalSpend;
    customerInfo["Total Products Purchased"] = totalProductsPurchased;
    customerInfo["Favourite Product"] = favouriteProduct;
    customerInfo["Favourite Category"] = favouriteCategory;
    customerInfo["Preferred Payment Type"] = preferredPaymentType;
    customerInfo["Preferred Delivery Type"] = preferredDeliveryType;
    customerInfo["Delivery Preference"] = deliveryPreference;

    // Push customer info to table data
    tableData.push(customerInfo);
  }

  return tableData;
}

function getProductInsights(data) {
    // Initialize map to store insights for each distinct product
    const productInsightsMap = new Map();

    // Iterate through each order to calculate insights
    data.forEach(order => {
        order.products.forEach(product => {
            const productId = product?.product?._id;
            const productName = product?.product?.name;

            // If product not already in the map, initialize insights
            if (!productInsightsMap.has(productId)) {
                productInsightsMap.set(productId, {
                    "Product Name": productName,
                    "Total Amount": 0,
                    "Quantity Sold": 0,
                    "Order Frequency": 0,
                    "Stock Quantity": 0,
                    "Total Cost": 0
                });
            }

            // Update insights for the product
            const productInsights = productInsightsMap.get(productId);
            productInsights["Total Amount"] += product.price;
            productInsights["Quantity Sold"] += product.quantity;
            productInsights["Order Frequency"]++;
            productInsights["Stock Quantity"] = product?.product?.stockQuantity;
            productInsights["Total Cost"] += product?.product?.costPrice || 0;
        });
    });

    // Calculate profit margin for each product
    for (let [productId, productInsights] of productInsightsMap) {
        const totalRevenue = productInsights["Total Amount"];
        const totalProfit = totalRevenue - (productInsights["Total Cost"]);
        const profitMargin = (totalProfit / totalRevenue) * 100;
        productInsights["Profit Margin"] = profitMargin.toFixed(2) + "%";

        // Calculate order frequency
        productInsights["Order Frequency"] = (productInsights["Order Frequency"] / data.length).toFixed(2);
    }

    // Return array of product insights
    return Array.from(productInsightsMap.values());
}



export const generatePerformanceReport = (orders) => {
  console.log("orders",orders);
  const customerData = generateCustomerTable(orders);
  const productsData = getProductInsights(orders);

  // Create a new jsPDF instance
  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  // Add title and header section
  pdf.setFontSize(20);
  pdf.text("Shop Performance Report", 105, 15, { align: "center" });
  pdf.setFontSize(12);
  pdf.text("Date: " + new Date().toLocaleDateString(), 105, 25, {
    align: "center",
  });
  pdf.line(10, 30, 200, 30);

  // Summary Section
  pdf.setFontSize(16);
  pdf.text("Summary", 10, 40);
  pdf.setFontSize(12);
  pdf.text(`Total Orders: ${orders.length}`, 10, 50);
  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalAmount,
    0
  );
  pdf.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 10, 60);
  const averageOrderValue = totalRevenue / orders.length;
  pdf.text(`Average Order Value: $${averageOrderValue.toFixed(2)}`, 10, 70);

  // Order Details Section
  pdf.setFontSize(16);
  pdf.text("Order Details", 10, 90);
  pdf.autoTable({
    startY: 100,
    head: [
      [
        "Order Number",
        "Date",
        "Customer Name",
        "Total Amount",
        "Payment Status",
      ],
    ],
    body: orders.map((order) => [
      order.orderNumber,
      new Date(order.orderDate).toLocaleDateString(),
      order.customer.name,
      `$${order.totalAmount.toFixed(2)}`,
      order.paymentStatus === 'captured' ? 'Paid' : order.paymentStatus,
    ]),
  });

  // Customer Insights Section
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text("Customer Insights", 10, 10);
  const customerColumns = [
    { header: "Name", dataKey: "Name" },
    { header: "Email", dataKey: "Email" },
    { header: "Phone", dataKey: "Phone" },
    // { header: "Location", dataKey: "Location" },
    { header: "Spend", dataKey: "Total Spend" },
    { header: "Products", dataKey: "Total Products Purchased" },
    { header: "Product", dataKey: "Favourite Product" },
    // { header: "Favourite Category", dataKey: "Favourite Category" },
    { header: "Payment", dataKey: "Preferred Payment Type" },
  ];

  // Define rows for the auto table
  const customerRows = customerData.map((customer) => [
    customer.Name,
    customer.Email,
    customer.Phone,
    // customer.Location,
    customer["Total Spend"],
    customer["Total Products Purchased"],
    customer["Favourite Product"],
    // customer["Favourite Category"],
    customer["Preferred Payment Type"],
  ]);

  // Add auto table to the document
  pdf.autoTable({
    startY: 15,
    head: [customerColumns.map((col) => col.header)],
    body: customerRows,
  });

  // Product Insights Section
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text("Product Insights", 10, 20);

  const productsColumns = [
    { header: "Name", dataKey: "Product Name" },
    { header: "Total", dataKey: "Total Amount" },
    { header: "Quantity", dataKey: "Quantity Sold" },
    // { header: "Frequency", dataKey: "Order Frequency" },
    { header: "Stock", dataKey: "Stock Quantity" },
    { header: "Total Cost", dataKey: "Total Cost" },
    { header: "Profit", dataKey: "Profit Margin" },
  ];

  // Define rows for the auto table
  const productsRows = productsData.map((product) => [
    product["Product Name"],
    product["Total Amount"],
    product["Quantity Sold"],
    // product["Order Frequency"],
    product["Stock Quantity"],
    product["Total Cost"],
    product["Profit Margin"],
  ]);

  // Add auto table to the document
  pdf.autoTable({
    startY: 30,
    head: [productsColumns.map((col) => col.header)],
    body: productsRows,
  });

  // Footer Section
  pdf.setFontSize(10);
  pdf.text("Contact Information: support@maliakkalstores.com", 10, 285);
  pdf.text("286Q+644, Padamughal, Kochi, Kakkanad, Kerala 682037", 10, 290);

  // Save the PDF with a specific filename
  const fileName = `Shop_Performance_Report_${new Date().getTime()}.pdf`;
  pdf.save(fileName);
};
