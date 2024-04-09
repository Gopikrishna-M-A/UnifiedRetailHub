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
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});


  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [companyName,setCompanyName] = useState('')
  const [displayName,setDisplayName] = useState('')
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [MSME,setMSME] = useState(true)
  const [PAN,setPAN] = useState('')
  const [registrationType,setRegistrationType] = useState('')
  const [registrationNumber,setRegistrationNumber] = useState('')
  const [currency,setCurrency] = useState('')
  const [paymentTerms,setPaymentTerms] = useState('')
  const [website,setWebsite] = useState('')
  const [department,setDepartment] = useState('')


  const [shippingAttention,setShippingAttention] = useState('')
  const [shippingCountry,setShippingCountry] = useState('')
  const [shippingCity,setShippingCity] = useState('')
  const [shippingState,setShippingState] = useState('')
  const [shippingAddress,setShippingAddress] = useState('')
  const [shippingZipCode,setShippingZipCode] = useState('')
  const [shippingPhone,setShippingPhone] = useState('')

  const [billingAttention,setBillingAttention] = useState('')
  const [billingCountry,setBillingCountry] = useState('')
  const [billingCity,setBillingCity] = useState('')
  const [billingState,setBillingState] = useState('')
  const [billingAddress,setBillingAddress] = useState('')
  const [billingZipCode,setBillingZipCode] = useState('')
  const [billingPhone,setBillingPhone] = useState('')



  const [vendors,setVendors] = useState([])

  
  const copyBilling = () => {
    setShippingAttention(billingAttention)
    setShippingCountry(billingCountry)
    setShippingCity(billingCity)
    setShippingState(billingState)
    setShippingAddress(billingAddress)
    setShippingZipCode(billingZipCode)
    setShippingPhone(billingPhone)
  }




  useEffect(() => {
    axios.get(`${baseURL}/api/vendor`).then((res) => {
      setData(res.data)
    })

    axios.get(`${baseURL}/api/vendor`).then((res) => {
      setVendors(res.data)
      console.log("res",res.data);
    })
  }, []);



  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "displayName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        // <HoverCard>
        //   <HoverCardTrigger className="lowercase cursor-pointer">
        //     {row.getValue("name")}
        //   </HoverCardTrigger>
        //   <HoverCardContent>
        //     The React Framework – created and maintained by @vercel.
        //   </HoverCardContent>
        // </HoverCard>
        <div className="capitalize text-blue-500 font-bold cursor-pointer">{row.getValue("displayName")}</div>
        // <Dialog className="w-fit">
        //   <DialogTrigger>{row.getValue("displayName")}</DialogTrigger>
        //   <DialogContent className="flex justify-center items-center w-fit p-10">
        //     <ProductCard product={row.original} />
        //   </DialogContent>
        // </Dialog>
      ),
    },
    {
      accessorKey: "companyName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            	
            BILL#
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("companyName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "VENDOR NAME",
      cell: ({ row }) => {
        const email = row.getValue("email");
        return <div className="capitalize">{email}</div>;
      },
    },
    {
      accessorKey: "phone",
      header: "STATUS",
      cell: ({ row }) => {
        const phone = row.getValue("phone");
        return (
          <div className="capitalize">
           {phone}
          </div>
        );
      },
    },
    {
      accessorKey: "payables",
      header: () => <div className="text-right">DUE DATE</div>,
      cell: ({ row }) => {
        // const price = parseFloat(row.getValue("price"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format('0');

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "credits",
      header: () => <div className="text-right">AMOUNT</div>,
      cell: ({ row }) => {
        // const price = parseFloat(row.getValue("price"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format('0');

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
        accessorKey: "credits",
        header: () => <div className="text-right">BALANCE DUE</div>,
        cell: ({ row }) => {
          // const price = parseFloat(row.getValue("price"));
  
          // Format the amount as a dollar amount
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
          }).format('0');
  
          return <div className="text-right font-medium">{formatted}</div>;
        },
      },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(vendor._id)}
              >
                Copy Vendor ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/inventory/${vendor._id}`}>Edit Vendor</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const deleteProduct = async () => {
    try {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const selectedIds = selectedRows.map((row) => row.original._id);
      const selectedIndexs = selectedRows.map((row) => row.index);

      await Promise.all(
        selectedIds.map(async (id) => {
          await axios.delete(`${baseURL}/api/vendor/${id}`);
        })
      );

      setData(data.filter((vendor) => !selectedIds.includes(vendor._id)));

      setRowSelection({});
    } catch (error) {
      console.error("Error deleting categories:", error);
    }
  };

  const addNewItem = async() => {

    const requestBody = {
      primaryContact: {
        firstName,
        lastName
      },
      companyName,
      displayName,
      email,
      phone,
      PAN,
      MSME,
      registrationType,
      registrationNumber,
      currency,
      paymentTerms,
      website,
      department,
      billingAddress: {
        Attention: billingAttention,
        country: billingCountry,
        Address: billingAddress,
        city: billingCity,
        state: billingState,
        zipCode: billingZipCode,
        Phone: billingPhone,
      },
      shippingAddress: {
        Attention: shippingAttention,
        country: shippingCountry,
        Address: shippingAddress,
        city: shippingCity,
        state: shippingState,
        zipCode: shippingZipCode,
        Phone: shippingPhone,
      },
    };

    axios
      .post(`${baseURL}/api/vendor`, requestBody)
      .then((res) => {
        console.log(res.data);
        setData([...data, res.data]);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };



  return (
    <Card className="col-span-7">
      <CardHeader>
        <CardTitle className="flex justify-between">
        Bills
          <Dialog>
            <DialogTrigger asChild>
              <Button><Link href='/purchases/addBill'>Add New Bill</Link></Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl overflow-y-scroll max-h-full">
              <DialogHeader>
                <DialogTitle>New Item</DialogTitle>
                {/* <DialogDescription>
                  Enter the details below to add a new Item.
                </DialogDescription> */}
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Separator className="mb-5" />



                   

             
                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-40">Vendor Name</div>
                        <div className="w-full">
                        <Select
                          onValueChange={(e) => {
                            setDisplayName(e)
                          }}
                        >
                          <SelectTrigger className='w-3/4'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                                {vendors.map((vendor)=>(
                                 <SelectItem value='box'>{vendor.displayName}</SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                        </div>
                      </div>


                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-40">Bill#</div>
                        <div className="w-full">
                        <Input className='w-3/4' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                      </div>


                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-40">Order Number</div>
                        <div className="w-full">
                        <Input className='w-3/4' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                      </div>


                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-40">Bill Date</div>
                        <div className="w-full">
                        <Input className='w-3/4' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                      </div>

                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-40">Due Date</div>
                        <div className="w-full">
                        <Input className='w-3/4' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                      </div>


                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-40">Payment Terms</div>
                        <div className="w-full">
                        <Select
                          onValueChange={(e) => {
                            setDisplayName(e)
                          }}
                        >
                          <SelectTrigger className='w-3/4'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                                 <SelectItem value='box'>Net 15</SelectItem>
                                 <SelectItem value='box'>Net 30</SelectItem>
                                 <SelectItem value='box'>Net 45</SelectItem>
                                 <SelectItem value='box'>Net 60</SelectItem>
                                 <SelectItem value='box'>Due end of the month</SelectItem>
                                 <SelectItem value='box'>Due end of next month</SelectItem>
                                 <SelectItem value='box'>Due on receipt</SelectItem>
                                 <SelectItem value='box'>Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        </div>
                      </div>
                  
                </div>
              </div>

              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    size="lg"
                    className="w-full"
                    type="button"
                    onClick={addNewItem}
                  >
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Total {data.length} {data.length === 1 ? "bill" : "bills"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex gap-1 items-center justify-between py-4">
            <Input
              placeholder="Filter name..."
              value={table.getColumn("displayName")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("displayName")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={deleteProduct}
                disabled={!Object.keys(rowSelection).length}
                variant="destructive"
              >
                Delete
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
