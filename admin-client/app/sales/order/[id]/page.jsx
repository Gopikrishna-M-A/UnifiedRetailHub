"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { CalendarDateRangePicker } from "../../../../components/dashboard/date-range-picker";
import { Overview } from "../../../../components/dashboard/overview";
import { RecentSales } from "../../../../components/dashboard/recent-sales";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import Customers from "../../../../components/sales/customers";
import Orders from "../../../../components/sales/Orders";
import { cn } from "../../../../lib/utils";
import { isSameDay, format, parseISO, set } from "date-fns";
import { useEffect, useState } from "react";
import Bill from "../../../../components/sales/Bill";
import axios from "axios";
import { Steps, Timeline } from "antd";

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

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

function formatDate(inputDateTime) {
  const dateTimeObject = parseISO(inputDateTime);
  const formattedDate = format(dateTimeObject, "MMM d");
  const formattedTime = format(dateTimeObject, "h:mm a");

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

const orderMapping = {
  0: "Processing",
  1: "Packed",
  2: "Shipped",
  3: "Delivered",
  4: "Completed",
  5: "Cancelled",
  6: "Refunded",
};

const orderNumberMapping = {
  Processing: 0,
  Packed: 1,
  Shipped: 2,
  Delivered: 3,
  Completed: 4,
  Cancelled: 5,
  Refunded: 6,
};

export default function Page({ params }) {
  const [order, setOrder] = useState({});
  const [dateTime, setDateTime] = useState();
  const [Cancelled, setCancelled] = useState(false);
  const [Refunded, setRefunded] = useState(false);
  useEffect(() => {
    axios.get(`${baseURL}/api/orders/${params.id}`).then((res) => {
      setOrder(res.data);
      setDateTime(formatDate(res.data.orderDate));
      setRefunded(
        res.data.orderStatus.some((status) => status.status === "Refunded")
      );
      setCancelled(
        res.data.orderStatus.some((status) => status.status === "Cancelled")
      );
    });
  }, []);

  useEffect(() => {
    axios.get(`${baseURL}/api/orders/${params.id}`).then((res) => {
      setRefunded(
        res.data.orderStatus.some((status) => status.status === "Refunded")
      );
      setCancelled(
        res.data.orderStatus.some((status) => status.status === "Cancelled")
      );
    });
  }, [order]);

  const updateOrder = (key) => {
    if (key == 0) {
      if (order?.orderStatus?.length == 1) return;
      axios
        .post(`${baseURL}/api/orders/statusRemove/${order._id}`)
        .then((res) => {
          setOrder(res.data.order);
          console.log(res.data.order.orderStatus);
        });
    } else if (key == 1) {
      if (order?.orderStatus?.length == 5) return;
      if (
        order?.orderStatus[order?.orderStatus?.length - 1]?.status ==
        "Completed"
      )
        return;
      axios
        .post(`${baseURL}/api/orders/statusUpdate/${order._id}`, {
          status: orderMapping[order.orderStatus.length],
        })
        .then((res) => {
          setOrder(res.data.order);
          console.log(res.data.order.orderStatus);
        });
    } else if (
      key == 2 &&
      (order?.orderStatus.some((status) => status.status === "Completed") ||
      order?.orderStatus.some((status) => status.status === "Cancelled"))
    ) {
      axios
        .post(`${baseURL}/api/orders/statusUpdate/${order._id}`, {
          status: "Refunded",
        })
        .then((res) => {
          setOrder(res.data.order);
          console.log(res.data.order.orderStatus);
        });
    } else if (key == 3) {
      axios
        .post(`${baseURL}/api/orders/statusUpdate/${order._id}`, {
          status: "Cancelled",
        })
        .then((res) => {
          setOrder(res.data.order);
          console.log(res.data.order.orderStatus);
        });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle className="flex justify-between">
            {order.OrderId}
          </CardTitle>
          <CardDescription>
            {dateTime?.date} &nbsp; {dateTime?.time}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-10 justify-between">
            <Bill order={order} />
            <div>
              <Steps
                className="mt-2.5 mb-5"
                direction="vertical"
                size="small"
                current={order?.orderStatus?.length}
                items={[
                  ...(order?.orderStatus?.map((status, index) => {
                    return {
                      title: status.status,
                      subTitle: convertDateFormat2(status.timestamp),
                      description: status.desc,
                    };
                  }) || []),
                ]}
              />
              <div className="flex gap-10">
                <Button disabled={Cancelled} onClick={() => updateOrder(0)}>
                  Previous
                </Button>
                <Button disabled={Cancelled} onClick={() => updateOrder(1)}>
                  Next
                </Button>
              </div>
            </div>
            <div className="flex gap-10">
              <Button
                disabled={Refunded}
                onClick={() => updateOrder(2)}
                variant="outline"
              >
                Refund
              </Button>
              <Button
                disabled={Cancelled}
                onClick={() => updateOrder(3)}
                variant="destructive"
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
