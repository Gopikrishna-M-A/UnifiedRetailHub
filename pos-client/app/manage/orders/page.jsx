'use client'
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Bill from "@/components/ViewBill";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { formatDateAndTime, formatToINR } from "@/lib/formats";
export default function DataTableDemo() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders`)
      .then((res) => {
        const posOrders = res.data.filter(order => order.orderSource === 'pos');
        setOrders(posOrders);
        setFilteredOrders(posOrders);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handleSearch = (query) => {
    const filtered = orders.filter((order) =>
      order.customer.name.toLowerCase().includes(query.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const items = [
    { name: 'Apples', mrp:8.00, price: 3.99, quantity: 2 },
    { name: 'Bread', mrp:4.00, price: 2.50, quantity: 1 },
    { name: 'Milk', mrp:4.00, price: 1.99, quantity: 1 },
];

const handlePrint = useCallback(async (order) => {
  console.log("selected",order);
  
  try {
    // Fetch the PDF from your API endpoint
    const response = await fetch('/api/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // You can pass any necessary data in the body
      body: JSON.stringify({order}),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }

    // Get the PDF as a Blob
    const pdfBlob = await response.blob();

    // Create a Blob URL
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);

    // Wait for the iframe to load
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };

    // Clean up
    iframe.onafterprint = () => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(pdfUrl);
    };
  } catch (error) {
    console.error('Error printing PDF:', error);
    alert('Failed to print receipt');
  }
}, []);




  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full p-10">
        <Card className="col-span-7 w-full">
          <CardHeader>
            <CardTitle className="flex justify-between">Orders</CardTitle>
            <CardDescription>
              Total {filteredOrders.length} {filteredOrders.length === 1 ? "Order" : "Orders"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <div className="flex gap-1 items-center justify-between py-4">
                <Input
                  placeholder="Filter orders..."
                  onChange={(e) => handleSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className='hidden sm:table-cell'>Order No</TableHead>
                      <TableHead className='hidden sm:table-cell'>Date/Time</TableHead>
                      <TableHead className='hidden md:table-cell'>Method</TableHead>
                      <TableHead className='text-center'>Status</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                      <TableHead className='text-right'>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order._id}
                        className='bg-accent cursor-pointer'
                        >
                        <TableCell>
                          <div className='font-medium'>{order.customer.name}</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            {order.customer.email}
                          </div>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'
                        onClick={() => handleOrderClick(order)}>
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell capitalize'>
                          {formatDateAndTime(order.orderDate)}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          <Badge className='text-xs' variant='secondary'>
                            {order.method}
                          </Badge>
                        </TableCell>
                        <TableCell className='hidden md:table-cell text-center'>
                          {order.paymentStatus}
                        </TableCell>
                        <TableCell className='text-right'>
                          {formatToINR(order.totalAmount)}
                        </TableCell>
                        <TableCell className='text-right'>
                        <Button onClick={()=>handlePrint(order)}>Print</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="bill-container"  />             

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className='h-[700px] overflow-scroll'>
            <DialogHeader>
              <DialogTitle>Invoice</DialogTitle>
            </DialogHeader>
            <div className="w-full flex justify-center items-center">
              <Bill 
                order={selectedOrder}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}