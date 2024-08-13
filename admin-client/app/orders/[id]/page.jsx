"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { useEffect, useState } from "react"
import axios from "axios"
import { Steps } from "antd"
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Smartphone,
  Truck,
} from "lucide-react"
import { formatDate, formatDateAndTime, formatToINR } from "@/lib/formats"
import { Separator } from "@/components/ui/separator"

const orderMapping = {
  0: "Processing",
  1: "Packed",
  2: "Shipped",
  3: "Delivered",
  4: "Completed",
  5: "Cancelled",
  6: "Refunded",
}

export default function Page({ params }) {
  const [order, setOrder] = useState({})
  const [Cancelled, setCancelled] = useState(false)
  const [Refunded, setRefunded] = useState(false)
  useEffect(() => {
    axios.get(`/api/orders?id=${params.id}`).then((res) => {
      setOrder(res.data)
      setRefunded(
        res.data.orderStatus.some((status) => status.status === "Refunded")
      )
      setCancelled(
        res.data.orderStatus.some((status) => status.status === "Cancelled")
      )
    })
  }, [])

  useEffect(() => {
    axios.get(`/api/orders?id=${params.id}`).then((res) => {
      setRefunded(
        res.data.orderStatus.some((status) => status.status === "Refunded")
      )
      setCancelled(
        res.data.orderStatus.some((status) => status.status === "Cancelled")
      )
    })
  }, [order])

  const updateOrder = (key) => {
    if (key == 0) {
      if (order?.orderStatus?.length == 1) return
      axios.delete(`/api/orders/status?id=${order._id}`).then((res) => {
        setOrder(res.data)
        console.log(res.data.orderStatus)
      })
    } else if (key == 1) {
      if (order?.orderStatus?.length == 5) return
      if (
        order?.orderStatus[order?.orderStatus?.length - 1]?.status ==
        "Completed"
      )
        return
      axios
        .patch(`/api/orders/status?id=${order._id}`, {
          status: orderMapping[order.orderStatus.length],
        })
        .then((res) => {
          setOrder(res.data)
          console.log(res.data.orderStatus)
        })
    } else if (
      key == 2 &&
      (order?.orderStatus.some((status) => status.status === "Completed") ||
        order?.orderStatus.some((status) => status.status === "Cancelled"))
    ) {
      axios
      .patch(`/api/orders/status?id=${order._id}`, {
          status: "Refunded",
        })
        .then((res) => {
          setOrder(res.data)
          console.log(res.data.orderStatus)
        })
    } else if (key == 3) {
      axios
      .patch(`/api/orders/status?id=${order._id}`, {
          status: "Cancelled",
        })
        .then((res) => {
          setOrder(res.data)
          console.log(res.data.orderStatus)
        })
    }
  }

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
        <Card x-chunk='dashboard-05-chunk-3'>
          <CardHeader className='px-7'>
            <div className='flex justify-between'>
              <div className='flex flex-col gap-1'>
                <CardTitle>{order?.orderNumber}</CardTitle>
                <CardDescription>
                  {formatDate(order?.orderDate)}
                </CardDescription>
              </div>

              <div className='flex gap-10'>
                <Button
                  disabled={Refunded}
                  onClick={() => updateOrder(2)}
                  variant='outline'>
                  Refund
                </Button>
                <Button
                  disabled={Cancelled}
                  onClick={() => updateOrder(3)}
                  variant='destructive'>
                  Cancel Order
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Steps
              className='mt-2.5 mb-5'
              direction='vertical'
              size='small'
              current={order?.orderStatus?.length}
              items={[
                ...(order?.orderStatus?.map((status, index) => {
                  return {
                    title: status.status,
                    subTitle: formatDateAndTime(status.timestamp),
                    description: status.desc,
                  }
                }) || []),
              ]}
            />
            <div className='flex gap-10'>
              <Button disabled={Cancelled} onClick={() => updateOrder(0)}>
                Previous
              </Button>
              <Button disabled={Cancelled} onClick={() => updateOrder(1)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
          <CardHeader className='flex flex-row items-start bg-muted/50'>
            <div className='grid gap-0.5'>
              <CardTitle className='group flex items-center gap-2 text-lg'>
                Order {order?.orderNumber}
                <Button
                  size='icon'
                  variant='outline'
                  className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'>
                  <Copy className='h-3 w-3' />
                  <span className='sr-only'>Copy Order ID</span>
                </Button>
              </CardTitle>
              <CardDescription>
                Date: {formatDate(order?.orderDate)}
              </CardDescription>
            </div>
            <div className='ml-auto flex items-center gap-1'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon' variant='outline' className='h-8 w-8'>
                    <MoreVertical className='h-3.5 w-3.5' />
                    <span className='sr-only'>More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Trash</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className='p-6 text-sm'>
            <div className='grid gap-3'>
              <div className='font-semibold'>Order Details</div>
              <ul className='grid gap-3'>
                {order?.products?.map((product) => (
                  <li className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>
                      {product?.product?.name} x{" "}
                      <span>{product?.quantity}</span>
                    </span>
                    <span>
                      {formatToINR(product?.quantity * product?.price)}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator className='my-2' />
              <ul className='grid gap-3'>
                <li className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>{formatToINR(order?.totalAmount)}</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span>{formatToINR(0)}</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Tax</span>
                  <span>{formatToINR(0)}</span>
                </li>
                <li className='flex items-center justify-between font-semibold'>
                  <span className='text-muted-foreground'>Total</span>
                  <span>{formatToINR(order?.totalAmount)}</span>
                </li>
              </ul>
            </div>
            <Separator className='my-4' />
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-3'>
                <div className='font-semibold'>Shipping Information</div>
                <address className='grid gap-0.5 not-italic text-muted-foreground'>
                  <span>{order?.customer?.name}</span>
                  <span>{order?.shippingAddress?.street}</span>
                  <span>
                    {order?.shippingAddress?.city},{" "}
                    {order?.shippingAddress?.zipCode}
                  </span>
                </address>
              </div>
              <div className='grid auto-rows-max gap-3'>
                <div className='font-semibold'>Billing Information</div>
                <div className='text-muted-foreground'>
                  Same as shipping address
                </div>
              </div>
            </div>
            <Separator className='my-4' />
            <div className='grid gap-3'>
              <div className='font-semibold'>Customer Information</div>
              <dl className='grid gap-3'>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Customer</dt>
                  <dd>{order?.customer?.name}</dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Email</dt>
                  <dd>
                    <a href='mailto:'>{order?.customer?.email}</a>
                  </dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Phone</dt>
                  <dd>
                    <a href='tel:'>{order?.customer?.phone}</a>
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className='my-4' />
            <div className='grid gap-3'>
              <div className='font-semibold'>Payment Information</div>
              <dl className='grid gap-3'>
                <div className='flex items-center justify-between'>
                  <dt className='flex items-center gap-1 text-muted-foreground'>
                    {order?.method == "cash" ? (
                      <Banknote className='h-4 w-4' />
                    ) : order?.method == "upi" ? (
                      <Smartphone className='h-4 w-4' />
                    ) : (
                      <CreditCard className='h-4 w-4' />
                    )}
                    {order?.method}
                  </dt>
                  {/* <dd>**** **** **** 4532</dd> */}
                </div>
              </dl>
            </div>
          </CardContent>
          <CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
            <div className='text-xs text-muted-foreground'>
              Updated <time dateTime='2023-11-23'>November 23, 2023</time>
            </div>
            <Pagination className='ml-auto mr-0 w-auto'>
              <PaginationContent>
                <PaginationItem>
                  <Button size='icon' variant='outline' className='h-6 w-6'>
                    <ChevronLeft className='h-3.5 w-3.5' />
                    <span className='sr-only'>Previous Order</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button size='icon' variant='outline' className='h-6 w-6'>
                    <ChevronRight className='h-3.5 w-3.5' />
                    <span className='sr-only'>Next Order</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
