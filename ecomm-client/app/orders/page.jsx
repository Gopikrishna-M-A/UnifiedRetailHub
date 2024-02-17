"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Breadcrumb,
  Steps,
  Popover,
  Divider,
  Spin,
  Empty,
} from "antd";
import {
  QuestionCircleOutlined,
  FilePdfOutlined,
  DropboxCircleFilled,
  CheckCircleFilled,
  CarFilled,
  EnvironmentFilled,
  StarFilled,
} from "@ant-design/icons";
import OrderItems from "../../components/Orders/OrderItems";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";

const { Title, Paragraph, Text } = Typography;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const page = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(orders.length);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseURL}/api/orders/history/${user._id}`
      );
      setOrders(data);
      setTotalOrders(data.length);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // const phase = CurrentOrder?.orderStatus && CurrentOrder.phase
  console.log(orders);

  function convertDateFormat(inputDate) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dateObject = new Date(inputDate);

    const year = dateObject.getFullYear();
    const month = months[dateObject.getMonth()];
    const day = dateObject.getDate();
    var hours = dateObject.getHours();
    var minutes = dateObject.getMinutes();
    minutes += 30;

    // Adjust hours if minutes overflow
    if (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }

    // Convert 24-hour time to 12-hour time with AM/PM
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    const formattedDate = `${month} ${day},${year} at ${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;

    return formattedDate;
  }


  return (
  <div className="px-10 py-2.5 ">
    <div className="">
      <div className="flex justify-between">
        <div className="flex gap-1 items-center">
          <Title level={3} >
            Your Orders
          </Title>
          <Paragraph type="secondary">({totalOrders})</Paragraph>
        </div>
        <div className="flex">
          <Button icon={<QuestionCircleOutlined />}>Need Help?</Button>
        </div>
      </div>
      <Breadcrumb
          items={[
          {
              title: <Link href="/orders">History</Link>,
            },
          ]}
        />
    </div>

      <div className="flex justify-between">
      <div className="w-3/5 bg-white rounded-md border mt-8 py-2.5 px-5 ">
        {orders.length ? orders.map((order,index) => (
            <div  key={order._id}>
            <div className="flex justify-between items-center">
              <div className="flex flex-col w-4/6">
                <Link href={`/orders/${order._id}`}><Title level={4}>Order #{order?.orderNumber} </Title></Link>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <Paragraph type="secondary">Order</Paragraph>
                    <Paragraph type="success">
                      &#10003;{" "}
                      {order?.paymentStatus == "captured"
                        ? "paid"
                        : "unpaid"}
                    </Paragraph>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Paragraph type="secondary">Amount</Paragraph>
                    <Text strong>&#8377; {order?.totalAmount}</Text>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Paragraph type="secondary">Estimated Delivery</Paragraph>
                    <Paragraph>{convertDateFormat(order.orderDate)}</Paragraph>
                  </div>
                  <div className="flex flex-col">
                    <Button type="primary" size="small">
                      {order?.orderStatus &&
                        order.orderStatus[order.phase].status}
                    </Button>
                  </div>
                </div>
              </div>
              {/* <div className="orders-map"></div> */}
            </div>

            <Steps
              className="mt-8 mb-5"
              current={order.phase}
              items={[
                {
                  title: "Processing",
                  icon: <CheckCircleFilled />,
                },
                {
                  title: "Packed",
                  icon: <DropboxCircleFilled />,
                },
                {
                  title: "Shipped",
                  icon: <CarFilled />,
                },
                {
                  title: "Delivered",
                  icon: <EnvironmentFilled />,
                },
                {
                  title: "Completed",
                  icon: <StarFilled />,
                },
              ]}
            />
           {index == orders.length-1 ? <></> :<Divider />}
            </div>
        )) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        </div>

        {/* <div className=" w-1/3 bg-white rounded-md border mt-8 py-2.5 px-5">

        </div> */}


      </div>
    
  </div>
  )
};

export default page;
