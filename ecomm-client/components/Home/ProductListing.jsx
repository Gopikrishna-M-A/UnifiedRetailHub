"use client";
import {
  AppstoreOutlined,
  MailOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Typography, Menu, Slider, Select, Empty } from "antd";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
const { Title, Text } = Typography;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const ProductCategory = ({ id, products, categories, allP }) => {
  const router = useRouter()
  const [category, setCategory] = useState(id);
  const [allProducts, setAllProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [menuKey,setMenuKey] = useState('')

  // console.log(products);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  useEffect(() => {
    const filteredProducts = allProducts.filter((product) => {
      const isCategoryMatch = category
        ? product.category._id === category
        : true;
      const isPriceInRange =
        product.sellingPrice >= minPrice && product.sellingPrice <= maxPrice;
      return isCategoryMatch && isPriceInRange;
    });

    setCategoryProducts(filteredProducts);
  }, [category, minPrice, maxPrice, allProducts]);

  const handleSliderChange = (values) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const generateCategoriesSection = () => {
    const categoriesSection = categories.map((category) => {
      const label = category.name;
      const key = category._id;

     
      return getItem(label, key, null, null, 'link');
    });
    return categoriesSection;
  };

  const items = [
      getItem("Favorites", "sub1", <MailOutlined />, [
      getItem("All Products", 1),
      // getItem("Current Promotions", 2),
      // getItem("New Products", 3),
      // getItem("Best Sellers", 4),
      // getItem("Worst Sellers", 5),
    ]),
    getItem(
      "Filters",
      "grp",
      null,
      [
        getItem(
          <div className="flex justify-between items-center p-3">
            <Text className=" w-2/5">Price Range</Text>
            <Slider
              className=" w-3/5"
              range
              defaultValue={[minPrice, maxPrice]}
              max={1000}
              min={0}
              onChange={handleSliderChange}
            />
          </div>,
          "6"
        ),
        // getItem(
        //   <div className="flex justify-between items-center p-3">
        //     <Text className="w-2/5">Rating</Text>
        //     <Slider className="w-3/5" defaultValue={3} max={5} />
        //   </div>,
        //   "7"
        // ),
        // getItem(
        //   <div className="flex justify-between items-center p-3">
        //     <Text className="w-2/5">Discount</Text>
        //     <Slider className="w-3/5" range defaultValue={[0, 100]} max={100} />
        //   </div>,
        //   "8"
        // ),
      ],
      "group"
    ),
    {
      type: "divider",
    },
    getItem("Categories", "sub4", <AppstoreOutlined />, [
      ...generateCategoriesSection(),
    ], 'group'),
  ];

  const changeCategory = (key) => {
    router.push(`/products/${key}`);
  }

  return (
    <div className="px-2 py-2 lg:px-10 lg:py-2.5 lg:pl-0 lg:pt-0 overflow-hidden flex h-[calc(100vh-73px)]">
      <div className=" hidden lg:block w-1/4 h-screen overflow-y-auto border-r ">
        {/* <Title level={5}>Products</Title> */}
        <Menu
          onClick={({ key, keyPath, domEvent }) => {
            setMenuKey(key)
            if(key == 1){
              router.push("/products");
            }
            if (key.length > 10 ) {
              
              changeCategory(key);
              // setCategory(key);
            }
          }}
       

          defaultSelectedKeys={[menuKey]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />
      </div>
      <div className=" w-full lg:w-3/4 h-screen overflow-y-auto lg:px-5 lg:py-2 lg:pr-0 no-scrollbar lg:pb-24 pb-24 flex flex-col ">
        <div className="flex justify-between mb-4">
          <Title level={4}>{allP ? 'All Products' : categoryProducts[0]?.category?.name}</Title>
          <div className="flex gap-1">
            <SortAscendingOutlined />
            <Select
              placeholder="sort"
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: "a-z", label: "A-Z" },
                { value: "z-a", label: "Z-A" },
                { value: "l-h", label: "Low - high" },
                { value: "h-l", label: "High - Low" },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-5 justify-center lg:justify-normal">
          {!categoryProducts.length && <div className="w-full h-full flex justify-center items-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Oops! It seems this category is currently empty. Check back later for exciting new products!"} /></div>}
          {categoryProducts.map((product) => (
             <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
