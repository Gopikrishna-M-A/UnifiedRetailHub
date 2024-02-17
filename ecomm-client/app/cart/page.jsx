"use client";
import { Button, message, Steps, Spin, Typography } from "antd";
import { useState } from "react";
import Cart from "../../components/Cart/Cart";
import Address from "../../components/Cart/Address";
import Payment from "../../components/Cart/Payment";


const page = () => {
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: "Cart",
      content: <Cart setCurrent={setCurrent} />,
    },
    {
      title: "Address",
      content: <Address setCurrent={setCurrent} />,
    },
    {
      title: "Payment",
      content: <Payment setCurrent={setCurrent}/>,
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const onChange = (value) => {
    console.log("onChange:", value);
    setCurrent(value);
  };

  return (
    <div className=" py-12 px-24">
      <Steps className="w-1/2 my-2.5 mx-auto" current={current} items={items} onChange={onChange} />

      <div>
        <div className=" mt-10 ">{steps[current].content}</div>
      </div>
    </div>
  );
};

export default page;
