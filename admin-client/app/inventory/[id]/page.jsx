"use client";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { CalendarDateRangePicker } from "../../../components/dashboard/date-range-picker";
import { Overview } from "../../../components/dashboard/overview";
import ProductsList from "../../../components/inventory/Items";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { set } from "date-fns";


const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const page = ({ params }) => {
  const [product, setProduct] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [attributes, setAttributes] = useState({});
  const [categories, setCategories] = useState([]);
  const [barcode,setBarcode] = useState("")
  const [parentAttributes, setParentAttributes] = useState([]);

  useEffect(() => {
    axios.get(`${baseURL}/api/products/${params.id}`).then((res) => {
      setProduct(res.data);
      setName(res.data.name);
      setDescription(res.data.description);
      setPrice(res.data.price);
      setCategory(res.data?.category._id);
      setAttributes(res.data?.attributes);
      setBarcode(res.data?.barcode)
    });

    axios.get(`${baseURL}/api/categories`).then((res) => {
      setCategories(res.data)
    })
  }, []);

  useEffect(() => {
    setAttributes({});
    setParentAttributes([]);
  
    if (category) {
      let catInfo = categories.find((cat) => cat._id === category);
      
      if (catInfo) {
        setParentAttributes([...catInfo.attributeKeys]);
  
        while (catInfo?.parentCategory?._id) {
          let parentCat = categories.find((cat) => cat._id === catInfo.parentCategory._id);
          
          if (parentCat?.attributeKeys?.length > 0) { 
            setParentAttributes((prevParentAttributes) => [
              ...prevParentAttributes,
              ...parentCat.attributeKeys,
            ]);
          }
          
          catInfo = parentCat;
        }
      }
    }
  }, [category]);


  

  const onSubmit = () => {
    const data ={
      name,
      description,
      price,
      category,
      attributes,
      barcode
    }
    axios.patch(`${baseURL}/api/products/${product._id}`, data)
  }






  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          <Link href="/inventory">Inventory</Link>
        </h2>
        {/* <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button>Download</Button>
      </div> */}
      </div>
      <Tabs defaultValue="items" className="space-y-4">
        <div className="flex justify-between">
          {/* <TabsList>
        <TabsTrigger value="items">items</TabsTrigger>
        <TabsTrigger value="item-groups">item groups</TabsTrigger>
        <TabsTrigger value="Composite-items">Composite items</TabsTrigger>
        <TabsTrigger value="Adjustments"> Adjustments</TabsTrigger>
      </TabsList> */}
        </div>
        <TabsContent value="items" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      Edit Product
                      <Button onClick={onSubmit}> Save Item</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>


                    <div className="flex gap-2 text-md -mt-4 items-center">
                      <div className="text-md text-foreground font-bold w-24">
                        Title
                      </div>
                      <Input
                        className="text-md text-muted-foreground "
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 text-md my-2 items-center">
                      <div className="text-md text-foreground font-bold w-24">
                        Description
                      </div>
                      <Input
                        className="text-md text-muted-foreground "
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 text-md my-2 items-center">
                      <div className="text-md text-foreground font-bold w-24">
                        Barcode
                      </div>
                      <Input
                        className="text-md text-muted-foreground "
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 text-md my-2 items-center">
                      <div className="text-md text-foreground font-bold w-24">
                        Category
                      </div>
                       <Select 
                       value={category}
                       onValueChange={(e)=>{
                        setCategory(e)
                        }}>
                        <SelectTrigger >
                          <SelectValue 
                          placeholder="Item Category"/>
                        </SelectTrigger>
                        <SelectContent >
                          {categories.map((cat) => (
                            <SelectItem value={cat._id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 text-md my-2 items-center">
                      <div className="text-md text-foreground font-bold w-24">
                        Price
                      </div>
                      <Input
                        className="text-md text-muted-foreground"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 text-md flex-col">
                      <div className="text-md text-foreground font-bold w-24">
                        Attributes
                      </div>
                    
                      {parentAttributes.map((key,index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <div className="text-sm text-foreground font-bold w-24">
                            {key}
                          </div>
                          <Input
                            className="text-md text-muted-foreground "
                            value={attributes[index] || ''}
                            onChange={(e) =>
                              setAttributes({
                                ...attributes,
                                [index]: e.target.value,
                              })
                            }
                          />
                        </div>
                      ))}

                    </div>
                    <div className="w-full flex gap-4 mt-5">
                      {product.images?.map((image) => (
                        <img
                          src={`/images/Products/${image}`}
                          className=" w-40 rounded border p-2"
                        />
                      ))}
                    </div>
                  </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
