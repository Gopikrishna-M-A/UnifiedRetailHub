"use client"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Loader, PlusCircle, Trash, Upload, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEffect, useState } from "react"
import axios from "axios"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function Dashboard({ params }) {
  const id = params.id
  const isEditMode = id !== "new"
  const router = useRouter()

  const [product, setProduct] = useState({
    type: "Goods",
    name: "",
    SKU: "",
    category: "",
    images: [],
    status: "",
    dimensions: { length: 0, width: 0, height: 0, unit: "cm" },
    weight: { value: 0, unit: "kg" },
    manufacturer: "",
    brand: "",
    MPN: "",
    ISBN: "",
    EAN: [],
    UPC: [],
    basePrice: 0,
    discountPercentage: 0,
    salesAccount: "",
    description: "",
    costPrice: 0,
    purchaseAccount: "",
    preferredVendor: "",
    inventoryAccount: "",
    initialStock: "",
    reorderPoint: 10,
    isFeatured: false,
    variants: [],
    totalStock: 0,
    reservedStock: 0,
  })

  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingImageIndex, setLoadingImageIndex] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          isEditMode
            ? axios.get(`/api/products?id=${id}`)
            : Promise.resolve({ data: null }),
          axios.get("/api/categories"),
        ])

        if (productRes) {
          setProduct(productRes.data)
          console.log(productRes.data)
        }
        setCategories(categoriesRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Failed to fetch data",
          description: "There was a problem with your request.",
        })
      }
    }

    fetchData()
  }, [isEditMode])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      if (isEditMode) {
        await axios.patch(`/api/products?id=${params.id}`, product)
      } else {
        await axios.post("/api/products", product)
      }
      toast({
        description: `Product ${
          isEditMode ? "updated" : "created"
        } successfully`,
      })
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        variant: "destructive",
        title: `Failed to ${isEditMode ? "update" : "create"} product`,
        description: "There was a problem with your request.",
      })
    }
    setIsLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleNestedInputChange = (parent, field, value) => {
    setProduct((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    setIsLoading(true)

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append("file", file))

      const response = await axios.post("/api/aws", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setTimeout(() => {
        setProduct((prev) => ({
          ...prev,
          images: Array.isArray(prev?.images) 
            ? [...prev.images, ...response.data]
            : [...response.data]
        }))
      }, 1000)
    } catch (error) {
      console.error("Error uploading images:", error)
      // Handle error (e.g., show error message to user)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleRemoveImage = async (index) => {
    const imageUrl = product.images[index]
    setLoadingImageIndex(index)

    try {
      if (imageUrl.includes("s3.amazonaws.com")) {
        const key = imageUrl.split("/").pop()
        await axios.delete(`/api/aws?key=${key}`)
      }

      setProduct((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }))
    } catch (error) {
      console.error("Error removing image:", error)
      // Handle error (e.g., show error message to user)
    } finally {
      setLoadingImageIndex(null)
    }
  }

  const handleAddVariant = () => {
    const newVariant = {
      stock: 0,
      value: "",
      additionalPrice: 0,
      variant: "size", // Default variant or adjust as needed
    }
    setProduct((prev) => ({
      ...prev,
      variants: [...(prev?.variants || []), newVariant],
    }))
  }

  const handleDeleteVariant = (index) => {
    console.log("Deleting index", index)

    setProduct((prev) => {
      console.log("Previous variants:", prev.variants)

      const updatedVariants = prev.variants.filter((_, i) => i !== index)

      console.log("Updated variants:", updatedVariants)

      return {
        ...prev,
        variants: updatedVariants,
      }
    })
  }
// Function to add a new EAN or UPC
const addIdentifier = (type) => {
  setProduct((prev) => ({
    ...prev,
    [type]: [...(prev?.[type] || []), ""],
  }));
};

// Function to update an EAN or UPC
const updateIdentifier = (type, index, value) => {
  setProduct((prev) => ({
    ...prev,
    [type]: (prev?.[type] || []).map((item, i) => (i === index ? value : item)),
  }));
};

// Function to remove an EAN or UPC
const removeIdentifier = (type, index) => {
  setProduct((prev) => ({
    ...prev,
    [type]: (prev?.[type] || []).filter((_, i) => i !== index),
  }));
};

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/products'>
          <Button variant='outline' size='icon' className='h-7 w-7'>
            <ChevronLeft className='h-4 w-4' />
            <span className='sr-only'>Back</span>
          </Button>
          </Link>
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>

          {isEditMode &&
            (product?.totalStock > 0 ? (
              <Badge variant='outline' className='ml-auto sm:ml-0'>
                In stock
              </Badge>
            ) : (
              <Badge variant='destructive' className='ml-auto sm:ml-0'>
                Out of stock
              </Badge>
            ))}

          <div className='hidden items-center gap-2 md:ml-auto md:flex'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push("/products")}>
              Discard
            </Button>
            <Button size='sm' onClick={handleSave} disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </div>
        <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
          <div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
            <Card x-chunk='dashboard-07-chunk-0'>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Enter key product info for a smooth customer experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                      id='name'
                      name='name'
                      type='text'
                      value={product?.name}
                      onChange={handleInputChange}
                      className='w-full'
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='description'>Description</Label>
                    <Textarea
                      id='description'
                      name='description'
                      value={product?.description}
                      onChange={handleInputChange}
                      className='min-h-32'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stock</CardTitle>
                <CardDescription>
                  Manage your supermarket inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[100px]'>SKU</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className='w-[150px]'>Variant</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product?.variants?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className='font-semibold'>
                          {item?.sku}
                        </TableCell>
                        <TableCell>
                          <Label
                            htmlFor={`stock-${index + 1}`}
                            className='sr-only'>
                            Stock
                          </Label>
                          <Input
                            id={`stock-${index + 1}`}
                            type='number'
                            defaultValue={item.stock}
                          />
                        </TableCell>
                        <TableCell>
                          <Label
                            htmlFor={`price-${index + 1}`}
                            className='sr-only'>
                            Price
                          </Label>
                          <Input
                            id={`price-${index + 1}`}
                            type='number'
                            step='0.01'
                            defaultValue={item.additionalPrice}
                          />
                        </TableCell>
                        <TableCell>
                          <Label
                            htmlFor={`value-${index + 1}`}
                            className='sr-only'>
                            Value
                          </Label>
                          <Input
                            id={`value-${index + 1}`}
                            step='0.01'
                            defaultValue={item.value}
                          />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={item?.variant}>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select variant type' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='size'>Size</SelectItem>
                              <SelectItem value='color'>Color</SelectItem>
                              <SelectItem value='material'>Material</SelectItem>
                              <SelectItem value='style'>Style</SelectItem>
                              <SelectItem value='flavor'>Flavor</SelectItem>
                              <SelectItem value='weight'>Weight</SelectItem>
                              <SelectItem value='volume'>Volume</SelectItem>
                              <SelectItem value='pack'>Pack</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleDeleteVariant(index)}>
                            <Trash className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className='justify-center border-t p-4'>
                <Button
                  size='sm'
                  variant='ghost'
                  className='gap-1'
                  onClick={handleAddVariant}>
                  <PlusCircle className='h-3.5 w-3.5' />
                  Add Product
                </Button>
              </CardFooter>
            </Card>
            <Card x-chunk='dashboard-07-chunk-2'>
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 sm:grid-cols-3'>
                  <div className='grid gap-3'>
                    <Label htmlFor='category'>Category</Label>
                    <Select
                      value={product?.category?._id}
                      onValueChange={(value) =>
                        setProduct((prev) => ({ ...prev, category: value }))
                      }>
                      <SelectTrigger id='category' aria-label='Select category'>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category, index) => (
                          <SelectItem value={category?._id}>
                            {category?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='subcategory'>Subcategory (optional)</Label>
                    <Select disabled>
                      <SelectTrigger
                        id='subcategory'
                        aria-label='Select subcategory'>
                        <SelectValue placeholder='Select subcategory' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category, index) => (
                          <SelectItem value={category?._id}>
                            {category?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <Label>Dimensions</Label>
                    <div className='flex gap-2'>
                      <Input
                        type='number'
                        placeholder='Length'
                        value={product?.dimensions?.length}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "dimensions",
                            "length",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        type='number'
                        placeholder='Width'
                        value={product?.dimensions?.width}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "dimensions",
                            "width",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        type='number'
                        placeholder='Height'
                        value={product?.dimensions?.height}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "dimensions",
                            "height",
                            e.target.value
                          )
                        }
                      />
                      <Select
                        value={product?.dimensions?.unit}
                        onValueChange={(value) =>
                          handleNestedInputChange("dimensions", "unit", value)
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder='Unit' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='cm'>cm</SelectItem>
                          <SelectItem value='in'>in</SelectItem>
                          <SelectItem value='m'>m</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <Label>Weight</Label>
                    <div className='flex gap-2'>
                      <Input
                        type='number'
                        placeholder='Weight'
                        value={product?.weight?.value}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "weight",
                            "value",
                            e.target.value
                          )
                        }
                      />
                      <Select
                        value={product?.weight?.unit}
                        onValueChange={(value) =>
                          handleNestedInputChange("weight", "unit", value)
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder='Unit' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='g'>g</SelectItem>
                          <SelectItem value='kg'>kg</SelectItem>
                          <SelectItem value='ml'>ml</SelectItem>
                          <SelectItem value='l'>l</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-x-3 gap-y-6'>
                    <div className='grid gap-3'>
                      <Label htmlFor='manufacturer'>Manufacturer</Label>
                      <Input
                        id='manufacturer'
                        name='manufacturer'
                        type='text'
                        value={product?.manufacturer}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='grid gap-3'>
                      <Label htmlFor='brand'>Brand</Label>
                      <Input
                        id='brand'
                        name='brand'
                        type='text'
                        value={product?.brand}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className='grid gap-3 h-fit'>
                      <Label htmlFor='EAN'>EAN</Label>
                      {product?.EAN?.map((ean, index) => (
                        <div key={index} className='flex items-center gap-2'>
                          <Input
                            type='text'
                            value={ean}
                            onChange={(e) =>
                              updateIdentifier("EAN", index, e.target.value)
                            }
                          />
                          <Button
                            size='icon'
                            variant='ghost'
                            onClick={() => removeIdentifier("EAN", index)}>
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addIdentifier("EAN")}>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add EAN
                      </Button>
                    </div>

                    <div className='grid gap-3 h-fit'>
                      <Label htmlFor='UPC'>UPC</Label>
                      {product?.UPC?.map((upc, index) => (
                        <div key={index} className='flex items-center gap-2'>
                          <Input
                            type='text'
                            value={upc}
                            onChange={(e) =>
                              updateIdentifier("UPC", index, e.target.value)
                            }
                          />
                          <Button
                            size='icon'
                            variant='ghost'
                            onClick={() => removeIdentifier("UPC", index)}>
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addIdentifier("UPC")}>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add UPC
                      </Button>
                    </div>

                    <div className='grid gap-3'>
                      <Label htmlFor='MPN'>MPN</Label>
                      <Input
                        id='MPN'
                        name='MPN'
                        type='text'
                        value={product?.MPN}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='grid gap-3'>
                    <Label htmlFor='ISBN'>ISBN</Label>
                    <Input
                      id='ISBN'
                      name='ISBN'
                      type='text'
                      value={product?.ISBN}
                      onChange={handleInputChange}
                    />
                  </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-x-2 gap-y-6 grid-cols-2'>
                  <div className='grid gap-3'>
                    <Label htmlFor='inventoryAccount'>Inventory Account</Label>
                    <Input
                      id='inventoryAccount'
                      name='inventoryAccount'
                      type='text'
                      value={product?.inventoryAccount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='initialStock'>Stock</Label>
                    <Input
                      id='initialStock'
                      name='initialStock'
                      type='text'
                      value={product?.initialStock}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className='grid gap-3'>
                    <Label htmlFor='initialStockPrice'>
                    Initial Stock Price
                    </Label>
                    <Input
                      id='initialStockPrice'
                      name='initialStockPrice'
                      type='number'
                      value={product.initialStockPrice}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  <div className='grid gap-3'>
                    <Label htmlFor='reorderPoint'>Reorder Point</Label>
                    <Input
                      id='reorderPoint'
                      name='reorderPoint'
                      type='number'
                      value={product?.reorderPoint}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className='grid gap-3'>
                    <Label htmlFor='stockQuantity'>Stock Quantity</Label>
                    <Input
                      id='stockQuantity'
                      name='stockQuantity'
                      type='number'
                      value={product.stockQuantity}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  <div className='grid gap-3'>
                    <Label htmlFor='reservedStock'>Reserved Stock</Label>
                    <Input
                      id='reservedStock'
                      name='reservedStock'
                      type='number'
                      value={product?.reservedStock}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='type'>Type</Label>
                    <Select
                      value={product?.type}
                      onValueChange={(value) =>
                        setProduct((prev) => ({ ...prev, type: value }))
                      }>
                      <SelectTrigger id='type'>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Goods'>Goods</SelectItem>
                        <SelectItem value='Services'>Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid gap-3'>
                    <Label htmlFor='SKU'>SKU</Label>
                    <Input
                      disabled
                      id='SKU'
                      name='SKU'
                      type='text'
                      value={product?.SKU}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className='grid gap-3'>
                    <Label htmlFor='unit'>Unit</Label>
                    <Input
                      id='unit'
                      name='unit'
                      type='text'
                      value={product.unit}
                      onChange={handleInputChange}
                    />
                  </div> */}
                </div>
              </CardContent>
            </Card>

            <Card x-chunk='dashboard-07-chunk-3'>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='status'>Status</Label>
                    <Select
                      value={product?.status}
                      onValueChange={(value) =>
                        setProduct((prev) => ({ ...prev, status: value }))
                      }>
                      <SelectTrigger id='status' aria-label='Select status'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='draft'>Draft</SelectItem>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='discontinued'>
                          Discontinued
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-2'>
                  {product?.images?.[0] && (
                    <Image
                      alt='Main product image'
                      className='aspect-square w-full rounded-md object-cover'
                      height='300'
                      src={product.images[0]}
                      width='300'
                    />
                  )}
                  <div className='grid grid-cols-3 gap-2'>
                    {product?.images?.map((image, index) => (
                      <div key={index} className='relative group'>
                        <button>
                          <Image
                            alt={`Product image ${index + 1}`}
                            className='aspect-square w-full rounded-md object-cover border p-1'
                            height='84'
                            src={image}
                            width='84'
                          />
                        </button>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className='absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-50'>
                          {loadingImageIndex === index ? (
                            <Loader className='h-4 w-4 text-gray-500 animate-spin' />
                          ) : (
                            <X className='h-4 w-4 text-red-500' />
                          )}
                        </button>
                      </div>
                    ))}

                    <div className='relative flex aspect-square w-full items-center justify-center rounded-md border border-dashed hover:shadow-sm'>
                      <input
                        type='file'
                        multiple
                        onChange={handleImageUpload}
                        disabled={isLoading}
                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                      />
                      <div className='flex flex-col items-center justify-center'>
                        {isLoading ? (
                          <Loader className='h-4 w-4 text-muted-foreground animate-spin' />
                        ) : (
                          <Upload className='h-4 w-4 text-muted-foreground' />
                        )}
                        <span className='sr-only'>
                          {isLoading ? "Uploading..." : "Upload"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk='dashboard-07-chunk-5'>
              <CardHeader>
                <CardTitle>Feature Product</CardTitle>
                <CardDescription>
                  making it stand out among other products.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='isFeatured'
                    checked={product?.isFeatured}
                    onCheckedChange={(checked) =>
                      setProduct((prev) => ({ ...prev, isFeatured: checked }))
                    }
                  />
                  <Label htmlFor='isFeatured'>Featured Product</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='basePrice'>Maximum Retail Price</Label>
                    <Input
                      id='basePrice'
                      name='basePrice'
                      type='number'
                      value={product?.basePrice}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='discountPercentage'>
                      Discount Percentage
                    </Label>
                    <Input
                      id='discountPercentage'
                      name='discountPercentage'
                      type='number'
                      value={product?.discountPercentage}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='salesAccount'>Sales Account</Label>
                    <Input
                      id='salesAccount'
                      name='salesAccount'
                      type='text'
                      value={product?.salesAccount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='costPrice'>Cost Price</Label>
                    <Input
                      id='costPrice'
                      name='costPrice'
                      type='number'
                      value={product?.costPrice}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='purchaseAccount'>Purchase Account</Label>
                    <Input
                      id='purchaseAccount'
                      name='purchaseAccount'
                      type='text'
                      value={product?.purchaseAccount}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className='grid gap-3'>
                    <Label htmlFor='purchaseDescription'>
                      Purchase Description
                    </Label>
                    <Textarea
                      id='purchaseDescription'
                      name='purchaseDescription'
                      value={product.purchaseDescription}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  <div className='grid gap-3'>
                    <Label htmlFor='preferredVendor'>Preferred Vendor</Label>
                    <Input
                      id='preferredVendor'
                      name='preferredVendor'
                      type='text'
                      value={product?.preferredVendor}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className='flex items-center justify-center gap-2 md:hidden'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.push("/products")}>
            Discard
          </Button>
          <Button size='sm'>
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Update Product"
              : "Create Product"}
            {/* Save Product */}
          </Button>
        </div>
      </div>
    </main>
  )
}
