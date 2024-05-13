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
  RedoOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import OrderItems from "../../components/Orders/OrderItems";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";

const { Title, Paragraph, Text } = Typography;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const IconMapping = {
  Processing: <CheckCircleFilled />,
  Packed: <DropboxCircleFilled />,
  Shipped: <CarFilled />,
  Delivered: <EnvironmentFilled />,
  Completed: <StarFilled />,
  Cancelled: <CloseCircleFilled />,
  Refunded: <RedoOutlined />,
};

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

  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseURL}/api/orders/history/${user._id}`
      );
      const ecommerceOrders = data.filter(order => order.orderSource === 'ecommerce').reverse();
      setOrders(ecommerceOrders);
      setTotalOrders(ecommerceOrders.length);
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

  function DateFormat(inputDate) {
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

    const formattedDate = `${month} ${day} ${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;

    return formattedDate;
  }

  return (
    <div className="px-10 py-2.5">
      <div className="">
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            <Title level={3}>Your Orders</Title>
            <Paragraph type="secondary">({totalOrders})</Paragraph>
          </div>
          <div className="flex">
            <Link href={'mailto:support@maliakkalstores.com'}><Button icon={<QuestionCircleOutlined />}>Need Help?</Button></Link>
            
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
        <div className=" w-full bg-white rounded-md border mt-8 py-2.5 px-5 ">
          {orders.length ? (
            orders.map((order, index) => (
              <div key={order._id}>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col w-4/6">
                    <Link href={`/orders/${order._id}`}>
                      <Title level={4}> {order?.orderNumber} </Title>
                    </Link>
                    <div className="flex gap-10">
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
                        <Paragraph type="secondary">
                          Estimated Delivery
                        </Paragraph>
                        <Paragraph>
                          {convertDateFormat(order.orderDate)}
                        </Paragraph>
                      </div>
                      <div className="flex flex-col">
                        {/* <Button type="primary" size="small">
                      {order?.orderStatus &&
                        order.orderStatus[order.phase].status}
                    </Button> */}
                      </div>
                    </div>
                  </div>
                  {/* <div className="orders-map"></div> */}
                </div>

                <Steps
                  className="mt-8 mb-5"
                  current={order?.orderStatus?.length}
                  items={[
                    ...(order?.orderStatus?.map((status, index) => {
                      return {
                        title: status.status,
                        icon: IconMapping[status.status],
                        description: DateFormat(status.timestamp),
                      };
                    }) || []),
                  ]}
                />
                {index == orders.length - 1 ? <></> : <Divider />}
              </div>
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>


      </div>
    </div>
  );
};

export default page;
