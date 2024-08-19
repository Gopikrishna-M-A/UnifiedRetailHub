"use client"; // This component needs to run on the client side

import React from 'react';
import { useThermalPrinter } from 'react-thermal-printer';

const PrintReceipt = ({ order }) => {
  const { printer, isPrinting } = useThermalPrinter();

  const handlePrint = async () => {
    if (printer) {
      try {
        await printer.print('Maliakkal Stores');
        await printer.newLine();
        await printer.print('286Q+644, Padamughal');
        await printer.newLine();
        await printer.print('Kochi, Kakkanad, Kerala 682037');
        await printer.newLine();
        await printer.print('+91 1234567890');
        await printer.newLine();
        await printer.feed(1);
        await printer.print('Order Summary');
        await printer.newLine();
        await printer.print(`Customer: ${order.customer.name}`);
        await printer.print(`Phone: ${order.customer.phone}`);
        await printer.print(`Order No: ${order.orderNumber}`);
        await printer.newLine();
        await printer.print(`Date: ${new Date().toLocaleDateString()}`);
        await printer.print(`Time: ${new Date().toLocaleTimeString()}`);
        await printer.newLine();
        await printer.print('Items:');
        await printer.newLine();

        order.products.forEach(async (item) => {
          await printer.print(`${item.product.name} x ${item.quantity} - ₹ ${(item.price * item.quantity).toFixed(2)}`);
          await printer.newLine();
        });

        await printer.newLine();
        await printer.print(`TOTAL: ₹ ${order.totalAmount}`);
        await printer.newLine();
        await printer.print('Thank you for shopping with us!');
        await printer.newLine();
        await printer.cut();

        console.log('Print success');
      } catch (error) {
        console.error('Print error:', error);
      }
    }
  };

  return (
    <div>
      <button onClick={handlePrint} disabled={isPrinting}>
        Print Receipt
      </button>
    </div>
  );
};

export default PrintReceipt;