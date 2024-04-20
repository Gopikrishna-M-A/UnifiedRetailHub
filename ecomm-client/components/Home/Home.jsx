"use client";
import {
  MenuOutlined,
  ThunderboltOutlined,
  SyncOutlined,
  TagOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Carousel, Typography, Input, Select } from "antd";
import CategoryCard from "./CategoryCard";
import FeaturedCard from "./FeaturedCard";
import Image from "next/image";



const { Title, Text } = Typography;

const Home = ({ categories }) => {

  return (
    <div className=" px-2 py-1  lg:px-10 lg:py-2.5 ">
      {/* SHOP BY CATEGORY SECTION */}

      <div className="flex justify-between my-2.5 gap-1">
        <div className="lg:flex gap-1 hidden ">
          <Button icon={<MenuOutlined />}>SHOP BY CATEGORY</Button>
          <Button icon={<ThunderboltOutlined />} type="text">
            Deals Today
          </Button>
          <Button icon={<TagOutlined />} type="text">
            Special Prices
          </Button>
          <Select
            defaultValue="fresh"
            bordered={false}
            options={[{ value: "fresh", label: "Fresh" }]}
          />

          <Select
            defaultValue="frozen"
            bordered={false}
            options={[{ value: "frozen", label: "Frozen" }]}
          />

          <Select
            defaultValue="demos"
            bordered={false}
            options={[{ value: "demos", label: "Demos" }]}
          />

          <Select
            defaultValue="shop"
            bordered={false}
            options={[{ value: "shop", label: "Shop" }]}
          />
        </div>

        <div>
          <Button icon={<SyncOutlined />} type="text">
            Recently Viewed
          </Button>
        </div>
      </div>

      {/* BANNER SECTION */}

      <div className="flex banner w-full justify-between my-2.5">
        <div className="w-full ">
          <Carousel className="carousel" autoplay>
            <div className=" h-96 ">
              <Image
                width={816}
                height={320}
                src="/images/Banner/fresh.jpg"
                alt="Banner Image"
                className="w-full"
              />
            </div>
          </Carousel>
        </div>

  
      </div>

      {/* BROWSE BY CATEGORY SECTION */}
      <div className="flex-col my-2.5 mt-10 gap-1">
        <div className="flex items-center gap-2">
          <Title level={4}>Browse by Category</Title>
          <Text style={{ marginLeft: "20px" }} type="secondary">
            All Categories <RightOutlined />
          </Text>
        </div>

        <div className="flex flex-wrap  gap-5 lg:gap-2 mt-2.5 py-2.5 px-2.5 ">
          {categories.map((category,index) => {
            return <CategoryCard key={category._id} category={category} />;
          })}
        </div>
      </div>

      {/* FEATURED BRANDS SECTION */}

      {/* <div className="Row Vertical section" style={{ marginTop: "40px" }}>
        <div className="Row AI-C">
          <Title level={4}>Featured Brands</Title>
          <Text style={{ marginLeft: "20px" }} type="secondary">
            All Offers <RightOutlined />
          </Text>
        </div>

        <div className="Row JC-SB" style={{ marginTop: "10px" }}>
          <FeaturedCard Image="choco.jpg" />
          <FeaturedCard Image="" />
          <FeaturedCard Image="" />
          <FeaturedCard Image="" />
          <FeaturedCard Image="" />
        </div>
      </div> */}
    </div>
  );
};

export default Home;
