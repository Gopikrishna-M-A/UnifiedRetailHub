'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithPresets } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatToINR } from "@/lib/formats";

export default function PurchaseForm() {
  const { toast } = useToast();
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [billNumber, setBillNumber] = useState("");

  const [formData, setFormData] = useState({
    vendor: "",
    billNumber: "",
    invoiceNumber: "",
    billDate: new Date(),
    dueDate: new Date(),
    paymentTerms: "",
    discount: 0,
    tds: 0,
    adjustment: 0,
    entries: [{ product: "", quantity: 0, rate: 0, MRP: 0, amount: 0 }],
  });

  function generateRandomSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsResponse, productsResponse] = await Promise.all([
          axios.get("/api/vendors"),
          axios.get("/api/products"),
        ]);
        setVendors(vendorsResponse.data.vendors);
        setProducts(productsResponse.data.products);
        const generatedBillNumber = generateRandomSixDigitNumber().toString();
        setBillNumber(generatedBillNumber);
        setFormData(prevData => ({ ...prevData, billNumber: generatedBillNumber }));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch vendors and products",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [toast]);

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const newEntries = [...formData.entries];
      newEntries[index] = { ...newEntries[index], [name]: Number(value) };
      if (name === 'quantity' || name === 'rate') {
        newEntries[index].amount = newEntries[index].quantity * newEntries[index].rate;
      }
      setFormData({ ...formData, entries: newEntries });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSelectChange = (value, field, index = null) => {
    if (index !== null) {
      const newEntries = [...formData.entries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      setFormData({ ...formData, entries: newEntries });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { product: "", quantity: 0, rate: 0, MRP: 0, amount: 0 }],
    });
  };

  const calculateSubTotal = () => {
    return formData.entries.reduce((sum, entry) => sum + entry.amount, 0);
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    const discountAmount = (subTotal * formData.discount) / 100;
    return subTotal - discountAmount + formData.adjustment - formData.tds;
  };

  const onSubmit = async () => {
    const subTotal = calculateSubTotal();
    const total = calculateTotal();

    const purchaseData = {
      ...formData,
      subTotal,
      total,
      balance: total,
      status: "Pending",
    };

    console.log('data',purchaseData);
    

    try {
      const response = await axios.post("/api/purchases", purchaseData);
      toast({
        title: "Success",
        description: "Purchase bill created successfully",
      });
      console.log(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create purchase bill",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Purchase Bill</h1>
                <p className="text-sm text-gray-500">Bill #{billNumber}</p>
              </div>
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700">Vendor</label>
                <Select onValueChange={(value) => handleSelectChange(value, 'vendor')} value={formData.vendor}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor._id} value={vendor._id}>
                        {vendor.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bill Details Section */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <Input
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bill Date</label>
                <DatePickerWithPresets
                  setDateChange={(date) => handleDateChange(date, 'billDate')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <DatePickerWithPresets
                  setDateChange={(date) => handleDateChange(date, 'dueDate')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                <Select onValueChange={(value) => handleSelectChange(value, 'paymentTerms')} value={formData.paymentTerms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                    <SelectItem value="net-45">Net 45</SelectItem>
                    <SelectItem value="net-60">Net 60</SelectItem>
                    <SelectItem value="month-end">Due end of the month</SelectItem>
                    <SelectItem value="next-month-end">Due end of next month</SelectItem>
                    <SelectItem value="receipt">Due on receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items Table */}
            <Table className="mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                  <TableHead className="text-center">MRP</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.entries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={entry.product}
                        onValueChange={(value) => handleSelectChange(value, 'product', index)}
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
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        name="quantity"
                        value={entry.quantity}
                        onChange={(e) => handleInputChange(e, index)}
                        className="w-20 text-left m-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        name="rate"
                        value={entry.rate}
                        onChange={(e) => handleInputChange(e, index)}
                        className="w-20 text-left m-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        name="MRP"
                        value={entry.MRP}
                        onChange={(e) => handleInputChange(e, index)}
                        className="w-20 text-left m-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right ">
                      <Input
                        type="number"
                        name="amount"
                        value={entry.amount}
                        readOnly
                        className="w-24 text-left m-auto"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button
              type="button"
              variant="outline"
              onClick={addEntry}
              className="mb-8"
            >
              Add Item
            </Button>

            {/* Summary Section */}
            <div className="flex justify-end">
              <div className="w-1/2 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatToINR(calculateSubTotal().toFixed(2))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Discount:</span>
                  <Input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-20 text-right"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>TDS:</span>
                  <Input
                    type="number"
                    name="tds"
                    value={formData.tds}
                    onChange={handleInputChange}
                    className="w-20 text-right"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Adjustment:</span>
                  <Input
                    type="number"
                    name="adjustment"
                    value={formData.adjustment}
                    onChange={handleInputChange}
                    className="w-20 text-right"
                  />
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatToINR(calculateTotal().toFixed(2))}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
              <Button type="button" onClick={onSubmit}>Save Purchase Bill</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}