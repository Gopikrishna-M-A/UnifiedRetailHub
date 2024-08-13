"use client"
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  Smartphone,
  Truck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import axios from "axios"
import { convertDateFormat, formatDate, formatToINR } from "@/lib/formats"
import Link from "next/link"

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState()

  useEffect(() => {
    const getOrders = async () => {
      const res = await axios.get("/api/orders")
      setOrders(res.data.slice(0, 10))
      setSelectedOrder(res.data[0])
    }
    getOrders()
  }, [])

  useEffect(() => {
    console.log("selectedOrder", selectedOrder)
  }, [selectedOrder])

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
  }

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
          <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-0'>
            <CardHeader className='pb-3'>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription className='max-w-lg text-balance leading-relaxed'>
                Introducing Our Dynamic Orders Dashboard for Seamless Management
                and Insightful Analysis.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Create New Order</Button>
            </CardFooter>
          </Card>
          <Card x-chunk='dashboard-05-chunk-1'>
            <CardHeader className='pb-2'>
              <CardDescription>This Week</CardDescription>
              <CardTitle className='text-4xl'>{formatToINR(1329)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xs text-muted-foreground'>
                +25% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label='25% increase' />
            </CardFooter>
          </Card>
          <Card x-chunk='dashboard-05-chunk-2'>
            <CardHeader className='pb-2'>
              <CardDescription>This Month</CardDescription>
              <CardTitle className='text-4xl'>{formatToINR(5329)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xs text-muted-foreground'>
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label='12% increase' />
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue='week'>
          <div className='flex items-center'>
            <TabsList>
              <TabsTrigger value='week'>Week</TabsTrigger>
              <TabsTrigger value='month'>Month</TabsTrigger>
              <TabsTrigger value='year'>Year</TabsTrigger>
            </TabsList>
            <div className='ml-auto flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-7 gap-1 text-sm'>
                    <ListFilter className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only'>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Fulfilled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size='sm' variant='outline' className='h-7 gap-1 text-sm'>
                <File className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only'>Export</span>
              </Button>
            </div>
          </div>
          <TabsContent value='week'>
            <Card x-chunk='dashboard-05-chunk-3'>
              <CardHeader className='px-7'>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Recent orders from your store.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Type
                      </TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Status
                      </TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Date
                      </TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map((order) => (
                      <TableRow
                        className='bg-accent cursor-pointer'
                        onClick={() => handleOrderClick(order)}>
                        <TableCell>
                          <div className='font-medium'>
                            {order.customer.name}
                          </div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            {order.customer.email}
                          </div>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell capitalize'>
                          {order.orderSource}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          <Badge className='text-xs' variant='secondary'>
                            {order.orderStatus.at(-1).status}
                          </Badge>
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {convertDateFormat(order.orderDate)}
                        </TableCell>
                        <TableCell className='text-right'>
                          {formatToINR(order.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
          <CardHeader className='flex flex-row items-start bg-muted/50'>
            <div className='grid gap-0.5'>
              <CardTitle className='group flex items-center gap-2 text-lg'>
                Order {selectedOrder?.orderNumber}
                <Button
                  size='icon'
                  variant='outline'
                  className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'>
                  <Copy className='h-3 w-3' />
                  <span className='sr-only'>Copy Order ID</span>
                </Button>
              </CardTitle>
              <CardDescription>
                Date: {formatDate(selectedOrder?.orderDate)}
              </CardDescription>
            </div>
            <div className='ml-auto flex items-center gap-1'>
            <Link href={`/orders/${selectedOrder?._id}`}>
              <Button size='sm' variant='outline' className='h-8 gap-1'>
                <Truck className='h-3.5 w-3.5' />
                <span className='lg:sr-only xl:not-sr-only xl:whitespace-nowrap'>
                  Track Order
                </span>
              </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className='p-6 text-sm'>
            <div className='grid gap-3'>
              <div className='font-semibold'>Order Details</div>
              <ul className='grid gap-3'>
                {selectedOrder?.products?.map((product) => (
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
                  <span>{formatToINR(selectedOrder?.totalAmount)}</span>
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
                  <span>{formatToINR(selectedOrder?.totalAmount)}</span>
                </li>
              </ul>
            </div>
            <Separator className='my-4' />
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-3'>
                <div className='font-semibold'>Shipping Information</div>
                <address className='grid gap-0.5 not-italic text-muted-foreground'>
                  <span>{selectedOrder?.customer?.name}</span>
                  <span>{selectedOrder?.shippingAddress?.street}</span>
                  <span>
                    {selectedOrder?.shippingAddress?.city},{" "}
                    {selectedOrder?.shippingAddress?.zipCode}
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
                  <dd>{selectedOrder?.customer?.name}</dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Email</dt>
                  <dd>
                    <a href='mailto:'>{selectedOrder?.customer?.email}</a>
                  </dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Phone</dt>
                  <dd>
                    <a href='tel:'>{selectedOrder?.customer?.phone}</a>
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
                    {selectedOrder?.method == "cash" ? (
                      <Banknote className='h-4 w-4' />
                    ) : selectedOrder?.method == "upi" ? (
                      <Smartphone className='h-4 w-4' />
                    ) : (
                      <CreditCard className='h-4 w-4' />
                    )}
                    {selectedOrder?.method}
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
