"use client";
import { downloadInvoice } from "../../lib/invoice";
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
  CloseCircleFilled
} from "@ant-design/icons";
import OrderItems from "./OrderItems";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react"

const { Title, Paragraph, Text } = Typography;

const IconMapping = {
  "Processing": <CheckCircleFilled />,
  "Packed": <DropboxCircleFilled />,
  "Shipped": <CarFilled />,
  "Delivered": <EnvironmentFilled />,
  "Completed": <StarFilled />,
  "Cancelled": <CloseCircleFilled />,
  "Refunded": <RedoOutlined />,
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

const page = ({ orderId }) => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const { data: session } = useSession()
  const user = session?.user
  const [orders, setOrders] = useState([]);
  const [CurrentOrderId, setCurrentOrderId] = useState(orderId);
  const [CurrentOrder, setCurrentOrder] = useState({});
  const [CurrentOrderProducts, setCurrentOrderProducts] = useState([]);
  const [totalOrders, setTotalOrders] = useState(orders.length);
  const [loading, setLoading] = useState(false);

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
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseURL}/api/orders/${CurrentOrderId}`
      );
      setCurrentOrder(data);
      setCurrentOrderProducts(data.products);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (CurrentOrderId) {
      fetchOrder();
    }
  }, [CurrentOrderId]);


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
  function convertDateFormat2(inputDate) {
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
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    // Convert 24-hour time to 12-hour time with AM/PM
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    const formattedDate = `${month} ${day} ${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;

    return formattedDate;
  }

  const inputDateString = CurrentOrder.orderDate;
  const formattedDate = convertDateFormat(inputDateString);

  return (
    <div className="px-10 py-2.5 min-h-96">
      <div className="">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Title level={3}>Your Orders</Title>
            <Paragraph type="secondary">({totalOrders})</Paragraph>
          </div>
          <div className="flex gap-1">
          <Link href={'mailto:support@maliakkalstores.com'}><Button icon={<QuestionCircleOutlined />}>Need Help?</Button></Link>
            <Button
              disabled={totalOrders < 1 ? true : false}
              icon={<FilePdfOutlined />}
              onClick={()=>downloadInvoice(CurrentOrder)}
            >
              Download Invoice
            </Button>
          </div>
        </div>
        <Breadcrumb
          items={[
            totalOrders > 0 && {
              title: `${CurrentOrder?.orderNumber}`,
            },
            totalOrders > 0 && {
              title: <Link href="/orders">History</Link>,
            },
          ]}
        />
      </div>

      {!loading ? (
        <div className="flex justify-between">
          <div className="w-3/5 bg-white rounded-md border mt-8 py-2.5 px-5">
            {totalOrders == 0 && (
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                  height: 60,
                }}
                description={
                  <span>
                    You currently have no orders. Start exploring our products
                    and place your first order to see it here.
                  </span>
                }
              >
                <Link href={"/"}>
                  <Button type="primary">Order Now</Button>
                </Link>
              </Empty>
            )}
            {totalOrders > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col w-2/3">
                    <Title level={4}> {CurrentOrder?.orderNumber}</Title>
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-1">
                        <Paragraph type="secondary">Order</Paragraph>
                        <Paragraph type="success">
                          &#10003;{" "}
                          {CurrentOrder?.paymentStatus == "captured"
                            ? "paid"
                            : "unpaid"}
                        </Paragraph>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Paragraph type="secondary">Amount</Paragraph>
                        <Text strong>&#8377; {CurrentOrder?.totalAmount}</Text>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Paragraph type="secondary">
                          Estimated Delivery
                        </Paragraph>
                        <Paragraph>{formattedDate}</Paragraph>
                      </div>
                      <div className="flex flex-col">
                        {/* <Button type="primary" size="small">
                          {CurrentOrder?.orderStatus &&
                            CurrentOrder.orderStatus[CurrentOrder.orderStatus.length - 1].status}
                        </Button> */}
                      </div>
                    </div>
                  </div>
                  <div className=" w-20 h-20 bg-slate-300 rounded-md"></div>
                </div>

                {/* <Steps
                  className="mt-8 mb-5"
                  current={CurrentOrder?.orderStatus?.length}
                  items={[
                    
                    ...(CurrentOrder?.orderStatus?.map((status, index) => {
                      return {
                        title: status.status,
                        icon: IconMapping[status.status],
                      };
                    }) || []),
                  ]}
                /> */}

                <div className="mt-5 text-sm font-bold" >Track Details</div>
                <Steps
                  className="mt-2.5 mb-5 "
                  direction="vertical"
                  size="small"
                  current={CurrentOrder?.orderStatus?.length}
                  items={[

                    ...(CurrentOrder?.orderStatus?.map((status, index) => {
                      return {
                        title: status.status,
                        subTitle: convertDateFormat2(status.timestamp),
                        description: status.desc,
                      };
                    }) || []),
                    
                  ]}
                />
              </>
            )}
          </div>
          {totalOrders > 0 && (
            <div className="w-1/3 h-fit bg-white rounded-md border mt-8 py-2.5 px-5 ">
              <Title level={4}>Inside Package</Title>
              <OrderItems products={CurrentOrderProducts} />
              <Divider />
              <div className="flex justify-between">
                <Title level={5}>Total</Title>
                <Paragraph>&#8377; {CurrentOrder?.totalAmount}</Paragraph>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default page;
