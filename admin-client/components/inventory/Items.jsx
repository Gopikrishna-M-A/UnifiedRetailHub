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
import ProductCard from "./ProductCard";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function DataTableDemo() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [copyItem,setCopyItem] = useState('')

  const [categories, setCategories] = useState([]);

  const [goods, setGoods] = useState(true);
  const [service, setService] = useState(false);
  const [prodName, setProdName] = useState("");
  const [SKU, setSKU] = useState("");
  const [unit, setUnit] = useState("");
  const [prodCat, setProdCat] = useState("");
  const [fileList, setFileList] = useState([]);
  const [images,setImages]=useState([])

  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [brand, setBrand] = useState("");
  const [UPC, setUPC] = useState("");
  const [MPN, setMPN] = useState("");
  const [EAN, setEAN] = useState("");
  const [ISBN, setISBN] = useState("");

  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [MRP, setMRP] = useState("");
  const [salesAccount, setSalesAccount] = useState("");
  const [purchaseAccount, setPurchaseAccount] = useState("");
  const [salesDescription, setSalesDescription] = useState("");
  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [preferredVendor, setPreferredVendor] = useState("");

  const [inventoryAccount, setInventoryAccount] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [openingStockRatePerUnit, setOpeningStockRatePerUnit] = useState("");
  const [reorderPoint, setReorderPoint] = useState("");

  const [attributes, setAttributes] = useState([]);
  const [prodAttr, setProdAttr] = useState({});
  const [parentAttributes, setParentAttributes] = useState([]);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleGoodsChange = () => {
    setGoods(true);
    setService(false);
  };

  const handleServiceChange = () => {
    setGoods(false);
    setService(true);
  };



  useEffect(() => {
    axios.get(`${baseURL}/api/products`).then((res) => {
      setData(res.data);
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


  useEffect(() => {

    const updateCopyItem = async() => {
      const res = await axios.get(`${baseURL}/api/products/${copyItem}`)
      const product = res.data
      console.log("product",product);
      
       // setFileList(product.images)
       setGoods(product.type === "Goods");
       setService(product.type === "Service");
       setProdName(product.name);
       setUnit(product.unit);
       setProdCat(product.category._id);
       // setImages(imgs);
      //  setDimensions(`${product.dimention.length}x${product.dimention.width}x${product.dimention.height}`);
       setWeight(product.weight.value)
      //  setManufacturer(product.manufacturer);
      //  setBrand(product.brand);
      //  setMPN(product.MPN);
      //  setEAN(product.EAN);
      //  setISBN(product.ISBN);
       setUPC(product.UPC);
       setSellingPrice(product.sellingPrice);
       setCostPrice(product.costPrice);
       setMRP(product.MRP);
      //  setSalesAccount(product.salesAccount);
      //  setSalesDescription(product.description);
      //  setPurchaseAccount(product.purchaseAccount);
      //  setPurchaseDescription(product.purchaseDescription);
      //  setPreferredVendor(product.preferredVendor);
 
      //  setInventoryAccount(product.inventoryAccount);
      //  setOpeningStock(product.openingStock);
      //  setOpeningStockRatePerUnit(product.openingStockRatePerUnit);
      //  setReorderPoint(product.reorderPoint);
 
      //  setAttributes(product.attributes);
    }

    if (copyItem){
    updateCopyItem()
    }
     

  }, [copyItem]);


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
            className=' capitalize'
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
      accessorKey: "sellingPrice",
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("sellingPrice"));

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

  const addNewItem = async() => {
    const formData = new FormData();
    fileList.map((file) => {
      formData.append("file", file.originFileObj);
    });
    const res = await axios
      .post("/api/aws", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    const dimensionsArray = dimensions.split('x')
    console.log("image",res.data);
    const requestBody = {
      type: goods ? "Goods" : "Service",
      name: prodName,
      SKU: SKU,
      unit: unit,
      category: prodCat,
      images:res.data, 
      dimention: {
        length: dimensionsArray[0] || '',
        width: dimensionsArray[1] || '',
        height: dimensionsArray[2] || '',
        unit: 'cm',
      },
      weight: {
        value: weight,
        unit: 'gm',
      },
      manufacturer: manufacturer,
      brand: brand,
      MPN: MPN,
      EAN: EAN,
      ISBN: ISBN,
      UPC:UPC,
      sellingPrice: sellingPrice,
      costPrice: costPrice,
      MRP: MRP,
      salesAccount: salesAccount,
      description: salesDescription,
      purchaseAccount: purchaseAccount,
      purchaseDescription: purchaseDescription,
      preferredVendor: preferredVendor,
      inventoryAccount: inventoryAccount,
      openingStock: openingStock,
      openingStockRatePerUnit: openingStockRatePerUnit,
      reorderPoint: reorderPoint,
      attributes: prodAttr,
    };
    console.log("requestBody",requestBody);
    axios
      .post(`${baseURL}/api/products`, requestBody)
      .then((res) => {
        setGoods(true);
        setProdName('');
        setUnit('');
        setProdCat('');
        setWeight('')
        setUPC('');
        setSellingPrice('');
        setCostPrice('');
        setMRP('');
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

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2 w-full">

                    <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-32">Copy Product</div>
                    <Select
                          value={copyItem}
                          onValueChange={(e) => {
                            setCopyItem(e)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          {data
                            .slice() // Create a shallow copy of the array to avoid mutating the original
                            .sort((a, b) => a.name.localeCompare(b.name)) // Sort the array based on the 'name' property
                            .map((product) => (
                              <SelectItem  key={product._id} value={product._id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                    </div>
                      

                      <div className="w-full flex gap-7">
                        <div className="text-muted-foreground w-28">Type</div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={goods}
                            name="type"
                            id="goods"
                            onClick={handleGoodsChange}
                          />
                          <Label htmlFor="goods">Goods</Label>
                          <Checkbox
                            checked={service}
                            name="type"
                            id="service"
                            onClick={handleServiceChange}
                          />
                          <Label htmlFor="service">Service</Label>
                        </div>
                      </div>

                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-32">Name</div>
                        <Input value={prodName} onChange={(e) => setProdName(e.target.value)} />
                      </div>

                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-32">SKU</div>
                        <Input value={SKU} onChange={(e) => setSKU(e.target.value)} />
                      </div>

                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-32">Unit</div>
                        <Select
                          defaultValue="pcs"
                          value={unit}
                          onValueChange={(e) => {
                            setUnit(e)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value='box'>box</SelectItem>
                              <SelectItem value='cm'>cm</SelectItem>
                              <SelectItem value='dz'>dz</SelectItem>
                              <SelectItem value='ft'>ft</SelectItem>
                              <SelectItem value='g'>g</SelectItem>
                              <SelectItem value='in'>in</SelectItem>
                              <SelectItem value='kg'>kg</SelectItem>
                              <SelectItem value='km'>km</SelectItem>
                              <SelectItem value='lb'>lb</SelectItem>
                              <SelectItem value='mg'>mg</SelectItem>
                              <SelectItem value='ml'>ml</SelectItem>
                              <SelectItem value='m'>m</SelectItem>
                              <SelectItem value='pcs'>pcs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full flex gap-10">
                        <div className="text-muted-foreground w-32">
                          Category
                        </div>
                        <Select
                        value={prodCat}
                          onValueChange={(e) => {
                            setProdCat(e);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue  />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category, index) => (
                              <SelectItem key={index} value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Label>
                      Add Images
                      <p className=" text-muted-foreground text-sm font-light">
                        You can add up to 5 images, each not exceeding 5 MB.
                      </p>
                    </Label>
                    <div className=" w-full py-5 p-3  rounded border flex ">
                      <div className="text-muted-foreground">
                        <Upload
                          listType="picture-card"
                          fileList={fileList}
                          onChange={handleChange}
                          multiple={true}
                        >
                          {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10"></div>

                  <div className="w-full flex gap-10">
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">
                      Dimensions
                      </div>
                      <Input
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        placeholder="length x width x height"
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">Weight</div>
                      <Input value={weight} type='number' onChange={(e) => setWeight(e.target.value)} />
                    </div>
                  </div>

                  <div className="w-full flex gap-10">
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">
                        Manufacturer
                      </div>
                      <Input
                      value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">Brand</div>
                      <Input  value={brand} onChange={(e) => setBrand(e.target.value)} />
                    </div>
                  </div>

                  <div className="w-full flex gap-10">
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">UPC</div>
                      <Input value={UPC} onChange={(e) => setUPC(e.target.value)} />
                    </div>
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">MPN</div>
                      <Input   value={MPN} onChange={(e) => setMPN(e.target.value)} />
                    </div>
                  </div>

                  <div className="w-full flex gap-10">
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">EAN</div>
                      <Input  value={EAN} onChange={(e) => setEAN(e.target.value)} />
                    </div>
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">ISBN</div>
                      <Input value={ISBN} onChange={(e) => setISBN(e.target.value)} />
                    </div>
                  </div>

                  <div className="mt-10"></div>

                  <div className="w-full flex gap-10">
                    <div className="flex w-full">
                      <div className="flex items-center gap-2 mb-5">
                        <Checkbox checked name="Sales" id="Sales" />
                        <Label htmlFor="Sales">Sales Information</Label>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="flex items-center gap-2 mb-5">
                        <Checkbox checked name="Sales" id="Sales" />
                        <Label htmlFor="Sales">Purchase Information</Label>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex gap-10">
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">
                        Selling Price
                      </div>
                      <Input
                       value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        type="number"
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">
                        Cost Price
                      </div>
                      <Input
                      value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="w-full flex gap-10">
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">MRP</div>
                      <Input
                       value={MRP}
                        onChange={(e) => setMRP(e.target.value)}
                        type="number"
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">Account</div>
                      <Input
                       value={purchaseAccount}
                        onChange={(e) => setPurchaseAccount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full flex gap-10">
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">Account</div>
                      <Input
                         value={salesAccount}
                        onChange={(e) => setSalesAccount(e.target.value)}
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">
                        Description
                      </div>
                      <Textarea
                       value={purchaseDescription}
                        onChange={(e) => setPurchaseDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full flex gap-10">
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">
                        Description
                      </div>
                      <Textarea
                       value={salesDescription}
                        onChange={(e) => setSalesDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="text-muted-foreground w-40">
                        Preferred Vendor
                      </div>
                      <Input
                       value={preferredVendor}
                        onChange={(e) => setPreferredVendor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-10"></div>

                  <div className="flex items-center gap-2 mb-5">
                    <Checkbox checked name="Sales" id="Sales" />
                    <Label htmlFor="Sales">Track Inventory for this item</Label>
                  </div>

                  <div className="flex items-center">
                    <div className="text-muted-foreground w-32">
                      Inventory Account
                    </div>
                    <Input
                      value={inventoryAccount}
                      className="w-1/2"
                      onChange={(e) => setInventoryAccount(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="text-muted-foreground w-32">
                      Opening Stock
                    </div>
                    <Input
                    value={openingStock}
                      className="w-1/2"
                      onChange={(e) => setOpeningStock(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="text-muted-foreground w-32">
                      Opening Stock Rate per Unit
                    </div>
                    <Input
                     value={openingStockRatePerUnit}
                      className="w-1/2"
                      onChange={(e) =>
                        setOpeningStockRatePerUnit(e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="text-muted-foreground w-32">
                      Reorder Point
                    </div>
                    <Input
                      className="w-1/2"
                      onChange={(e) => setReorderPoint(e.target.value)}
                    />
                  </div>

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
