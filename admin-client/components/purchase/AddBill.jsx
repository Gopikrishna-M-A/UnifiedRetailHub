"use client";

import React, { useEffect, useState } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import axios from "axios";
import { set } from "date-fns";
import ProductCard from "../inventory/ProductCard";

export default function DataTableDemo() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [products, setProducts] = useState([]);

  const [vendor, setVendor] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [billDate, setBillDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  const [vendors, setVendors] = useState([]);

  const [entries, setEntries] = useState([
    { product: "", quantity: "", rate: "", amount: "" },
  ]);

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      { product:'', quantity: "", rate: "", amount: "" },
    ]);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);
  };

  const handleSelectChange = (index, value, name) => {
    const newEntries = [...entries];
    newEntries[index][name] = value;
    setEntries(newEntries);
  };

  const handleRemoveEntry = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  useEffect(() => {
    // axios.get(`${baseURL}/api/vendor`).then((res) => {
    //   setData(res.data)
    // })

    axios.get(`${baseURL}/api/vendor`).then((res) => {
      setVendors(res.data);
      console.log("res", res.data);
    });

    axios.get(`${baseURL}/api/products`).then((res) => {
      setProducts(res.data);
      console.log("res", res.data);
    });
  }, []);


  const display = () => {
    console.log("data",{
        entries:entries,
        vendor:vendor,
        billNumber:billNumber, 
        orderNumber:orderNumber,
        billDate:billDate,
        dueDate:dueDate,
        paymentTerms:paymentTerms

    });
  }

  const addNewItem = async () => {
    // const requestBody = {
    //   primaryContact: {
    //     firstName,
    //     lastName
    //   },
    //   companyName,
    //   displayName,
    //   email,
    //   phone,
    //   PAN,
    //   MSME,
    //   registrationType,
    //   registrationNumber,
    //   currency,
    //   paymentTerms,
    //   website,
    //   department,
    //   billingAddress: {
    //     Attention: billingAttention,
    //     country: billingCountry,
    //     Address: billingAddress,
    //     city: billingCity,
    //     state: billingState,
    //     zipCode: billingZipCode,
    //     Phone: billingPhone,
    //   },
    //   shippingAddress: {
    //     Attention: shippingAttention,
    //     country: shippingCountry,
    //     Address: shippingAddress,
    //     city: shippingCity,
    //     state: shippingState,
    //     zipCode: shippingZipCode,
    //     Phone: shippingPhone,
    //   },
    // };
    // axios
    //   .post(`${baseURL}/api/vendor`, requestBody)
    //   .then((res) => {
    //     console.log(res.data);
    //     setData([...data, res.data]);
    //   })
    //   .catch((error) => {
    //     console.error("Error adding product:", error);
    //   });
  };

  const calculateSubTotal = () => {
    let subTotal = 0;
    entries.forEach((entry) => {
      subTotal += parseFloat(entry.amount || 0);
    });
    return subTotal.toFixed(2);
  };

  const calculateTotal = () => {
    // Assuming there are additional calculations for discounts, TDS, and adjustments
    // For demonstration, I'm simply returning the subtotal as the total
    return calculateSubTotal();
  };

  return (
    <Card className="col-span-7">
      <CardHeader>
        <CardTitle className="flex justify-between">
          #213
          <Button onClick={handleAddEntry}>Add Product</Button>
        </CardTitle>
        <CardDescription>
          {/* Total {data.length} {data.length === 1 ? "bill" : "bills"} */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex flex-col gap-2">
            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Vendor Name</div>
              <div className="w-full">
                <Select
                  onValueChange={(e) => {
                    setVendor(e);
                  }}
                >
                  <SelectTrigger className="w-3/4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem value={vendor._id}>{vendor.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Bill#</div>
              <div className="w-full">
                <Input
                  className="w-3/4"
                  onChange={(e) => setBillNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Order Number</div>
              <div className="w-full">
                <Input
                  className="w-3/4"
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Bill Date</div>
              <div className="w-full">
                <Input
                  className="w-3/4"
                  onChange={(e) => setBillDate(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Due Date</div>
              <div className="w-full">
                <Input
                  className="w-3/4"
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex gap-10">
              <div className="text-muted-foreground w-40">Payment Terms</div>
              <div className="w-full">
                <Select
                  onValueChange={(e) => {
                    setPaymentTerms(e);
                  }}
                >
                  <SelectTrigger className="w-3/4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                    <SelectItem value="net-45">Net 45</SelectItem>
                    <SelectItem value="net-60">Net 60</SelectItem>
                    <SelectItem value="month-end">Due end of the month</SelectItem>
                    <SelectItem value="next-month-end">Due end of next month</SelectItem>
                    <SelectItem value="receipt">Due on receipt</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-1 items-center justify-between py-4"></div>
          <div className="">
            <div className="">
              {entries.map((entry, index) => (
                <div key={index} className="border rounded-md p-2 flex gap-2">
                  <Select
                    value={entry.product}
                    name="product"
                    onValueChange={(value) => handleSelectChange(index, value, "product")}
                    className="w-3/4"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    name="quantity"
                    value={entry.quantity}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Quantity"
                    type="number"
                    className="w-3/4"
                  />

                  <Input
                    name="rate"
                    value={entry.rate}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Rate"
                    type="number"
                    className="w-3/4"
                  />

                  <Input
                    name="amount"
                    value={entry.amount}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Amount"
                    type="number"
                    className="w-3/4"
                  />

                  <Button onClick={() => handleRemoveEntry(index)} variant="ghost" className="text-red-600">
                    X
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mt-10 flex justify-end">
            <div className="flex flex-col gap-5 bg-gray-200 rounded-md w-1/2 p-5">
                <div className="flex justify-between">
                    <p className=" text-muted-foreground">Sub Total</p>
                    <p>{calculateSubTotal()}</p>
                </div>
                <div className="flex justify-between">
                    <p className=" text-muted-foreground">Discount</p>
                    <Input className='w-40' type='number'></Input>
                    <p>0.00</p>
                </div>
                <div className="flex justify-between">
                    <p className=" text-muted-foreground">TDS</p>
                    <p>0.00</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className=" text-muted-foreground">Adjustment</p>
                    <Input className='w-40' type='number'></Input>
                    <p>0.00</p>
                </div>
                <div className="flex justify-between">
                    <p className="font-bold">Total</p>
                    <p className="font-bold">{calculateTotal()}</p>
                </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground"></div>
            <div className="space-x-2">
              <Button onClick={display}>Save</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
