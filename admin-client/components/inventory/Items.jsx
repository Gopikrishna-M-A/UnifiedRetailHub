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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
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
import ProductCard from "./ProductCard";

export default function DataTableDemo() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodCat, setProdCat] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [prodAttr, setProdAttr] = useState({});
  const [parentAttributes, setParentAttributes] = useState([]);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    axios.get(`${baseURL}/api/products`).then((res) => {
      setData(res.data);
      console.log(res.data);
    });

    axios.get(`${baseURL}/api/categories`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    setProdAttr({});
    setParentAttributes([]);

    if (prodCat) {
      let catInfo = categories.find((cat) => cat._id === prodCat);
      setParentAttributes([...catInfo.attributeKeys]);
      while (catInfo?.parentCategory?._id) {
        let parentCat = categories.find(
          (cat) => cat._id === catInfo.parentCategory._id
        );
        if (parentCat.attributeKeys.length > 0) {
          console.log("parentCat.attributeKeys", parentCat.attributeKeys);
          setParentAttributes((prevParentAttributes) => [
            ...prevParentAttributes,
            ...parentCat.attributeKeys,
          ]);
        }
        catInfo = parentCat;
      }
    }
  }, [prodCat]);

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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
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

        <Dialog className="w-fit">
        <DialogTrigger>{row.getValue("name")}</DialogTrigger>
        <DialogContent className="flex justify-center items-center w-fit p-10">
          <ProductCard product={row.original} />
        </DialogContent>
        </Dialog>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category");
        return <div className="capitalize">{category.name}</div>;
      },
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => {
        const isFeatured = row.getValue("isFeatured");
        return (
          <div className="capitalize">
            {isFeatured ? "Featured" : "Not Featured"}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(price);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
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
                onClick={() => navigator.clipboard.writeText(product._id)}
              >
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/inventory/${product._id}`}>Edit product</Link>
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
          await axios.delete(`${baseURL}/api/products/${id}`);
        })
      );

      setData(data.filter((product) => !selectedIds.includes(product._id)));

      setRowSelection({});
    } catch (error) {
      console.error("Error deleting categories:", error);
    }
  };

  const addNewItem = () => {
    const requestBody = {
      name: prodName,
      description: prodDesc,
      price: prodPrice,
      category: prodCat,
      attributes: prodAttr,
      images: ["product.jpg", "product.jpg", "product.jpg", "product.jpg"],
    };

    axios
      .post(`${baseURL}/api/products`, requestBody)
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
          Products
          <Dialog>
            <DialogTrigger asChild>
              <Button> Add New Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item</DialogTitle>
                <DialogDescription>
                  Enter the details below to add a new Item.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Input
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="Item name"
                  />
                  <Input
                    type="number"
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="Item Price"
                  />
                  <Textarea
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Item description"
                  />
                  <Select
                    onValueChange={(e) => {
                      setProdCat(e);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Item Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* {parentAttributes.map((attribute,index) => (
                       <div key={index} className="flex gap-2 w-full items-center">
                        <div className="w-24 capitalize text-sm text-foreground rounded-md bg-gray-100 px-3 py-2">{attribute}</div>
                        <Input
                          placeholder="Attribute value..."
                          onChange={(e) => {
                            setProdAttr((prevProdAttri) => ({
                              ...prevProdAttri,
                              [index]: e.target.value,
                            }));
                          }}
                        />
                       </div>
                      ))} */}

                  {parentAttributes.map((attribute, index) => (
                    <div key={index} className="flex gap-2 w-full items-center">
                      <div className="w-24 capitalize text-sm text-foreground rounded-md bg-gray-100 px-3 py-2">
                        {attribute}
                      </div>
                      <Input
                        placeholder="Attribute value..."
                        onChange={(e) => {
                          setProdAttr((prevProdAttri) => ({
                            ...prevProdAttri,
                            [index]: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
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
          Total {data.length} {data.length === 1 ? "product" : "products"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex gap-1 items-center justify-between py-4">
            <Input
              placeholder="Filter name..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
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
