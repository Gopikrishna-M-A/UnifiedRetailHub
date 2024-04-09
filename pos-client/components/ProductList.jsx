"use client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Product from "./Product";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
import { useCart } from "../contexts/cartContext";
import { toast } from "sonner"

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = () => {
      try {
        setLoading(true);
        if(navigator.onLine){
        axios.get(`${baseURL}/api/products`).then((res) => {
          setProducts(res.data);
          setFilteredProducts(res.data);
          localStorage.setItem("pos-products", JSON.stringify(res.data));
        });}else{
          const data = JSON.parse(localStorage.getItem("pos-products"));
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(()=>{
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        inputRef.current.focus();
      }
    }
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  },[])

  const clearSearch = () =>{
    setSearchQuery('')
  }


    const handleSearch = async (query) => {

      // Regular expression to check if the query consists only of numbers
      const isBarcode = /^\d+$/.test(query);
      let filtered;
    
      if (isBarcode) {
        // If the query is a barcode (consists of numbers), filter by barcode

        const pro = products.find((product)=>product.UPC == query)

        if(pro){
          addToCart(pro)
          clearSearch()
        }

      } else {
        // If the query is not a barcode, filter by name
        filtered = products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    };

  return (
    <div className=" w-[62%] h-screen-lg border-b border-r overflow-y-scroll pb-20">
      <div className="h-14 border-b">
        <Input
          ref={inputRef}
          placeholder="Search products"
          className="h-full rounded-none focus-visible:ring-transparent border-0 shadow-none px-6"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            handleSearch(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchQuery('');
          }
          }}
        />
      </div>
      <div className="flex flex-wrap gap-5 p-5">
        {loading ? (
             Array.from({ length: 15 }, (_, index) => (
          <div className="flex flex-col space-y-3">
            <Skeleton className=" h-24 w-36 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4  w-36" />
              <Skeleton className="h-4  w-36" />
            </div>
          </div>
           ))
        ) : (
          filteredProducts.map((product) => (
            <div onClick={() => addToCart(product)}>
              <Product key={product.id} product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
