"use client"
import Image from "next/image"
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { convertDateFormat, formatDate, formatDateAndTime, formatToINR, getInitials } from "@/lib/formats"
import { 
  calculateTotalSpend, 
  calculateAverageOrderValue, 
  getOrderCount, 
  getLastPurchaseDate, 
  getRecentOrders, 
  determineLoyaltyTier 
} from './customerMetricsUtils';

export default function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [customer,setCustomer] = useState('')

  const [orders,setOrders] = useState([])
  const [totalSpend, setTotalSpend] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [lastPurchaseDate, setLastPurchaseDate] = useState('');
  const [recentOrders, setRecentOrders] = useState([]);
  const [loyaltyTier, setLoyaltyTier] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersResponse = await axios.get("/api/customers");
        const fetchedCustomers = customersResponse.data.slice(0, 10);
        setCustomers(fetchedCustomers);

        // Set the first customer (if available)
        if (customer) {
          const ordersResponse = await axios.get(`/api/orders?customerId=${customer._id}`);
          setOrders(ordersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [customer]);


  useEffect(() => {
    setTotalSpend(calculateTotalSpend(orders));
    setAvgOrderValue(calculateAverageOrderValue(orders));
    setOrderCount(getOrderCount(orders));
    setLastPurchaseDate(getLastPurchaseDate(orders));
    setRecentOrders(getRecentOrders(orders));
    setLoyaltyTier(determineLoyaltyTier(totalSpend));
    
  }, [orders, customer]);
  

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <Tabs defaultValue='all'>
        <div className='flex items-center'>
          <TabsList>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='pos'>POS</TabsTrigger>
            <TabsTrigger value='ecommerce'>Ecommerce</TabsTrigger>
          </TabsList>
          <div className='ml-auto flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='h-8 gap-1'>
                  <ListFilter className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size='sm' variant='outline' className='h-8 gap-1'>
              <File className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Export
              </span>
            </Button>
            {/* <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add Product
              </span>
            </Button> */}
          </div>
        </div>
        <TabsContent value='all'>
          <div className='grid grid-cols-6 gap-2'>
          <Card x-chunk='dashboard-06-chunk-0' className='grid col-span-4 h-fit'>
            <CardHeader >
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Manage your customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='hidden w-[100px] sm:table-cell'>
                      <span className='sr-only'>Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className='hidden md:table-cell'>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    {/* <TableHead>
                      <span className='sr-only'>Actions</span>
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers?.map((customer) => (
                    <TableRow className='cursor-pointer' onClick={()=>setCustomer(customer)}>
                      <TableCell className='hidden sm:table-cell'>
                        {/* <Image
                          alt='Customer image'
                          className='aspect-square rounded-md object-cover'
                          height='64'
                          width='64'
                        /> */}
                        <Avatar>
                          <AvatarImage src={customer?.image} />
                          <AvatarFallback className='uppercase'>{getInitials(customer?.name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {customer?.name}
                      </TableCell>
                      <TableCell className='hidden md:table-cell'>
                        <Badge variant='outline' >{customer?.email}</Badge>
                      </TableCell>
                      <TableCell>
                        {customer?.phone}
                      </TableCell>
                      {/* <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup='true'
                              size='icon'
                              variant='ghost'>
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className='text-xs text-muted-foreground'>
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter>
          </Card>

          <Card className={`grid col-span-2 ${!customer && 'animate-pulse'}`}>
  <CardHeader>
    <div className="flex items-center space-x-4">
      <Avatar className="w-16 h-16 bg-gray-200">
        {customer ? (
          <>
            <AvatarImage src={customer?.image} alt={customer?.name} />
            <AvatarFallback>{customer?.name?.charAt(0)}</AvatarFallback>
          </>
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
      </Avatar>
      <div>
        {customer ? (
          <>
            <CardTitle>{customer?.name}</CardTitle>
            <CardDescription>{customer?.email}</CardDescription>
          </>
        ) : (
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            <div className="w-48 h-4 bg-gray-300 rounded"></div>
          </div>
        )}
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <section>
        <h3 className="font-semibold mb-2">Financial Overview</h3>
        <div className="grid grid-cols-2 gap-2">
          {customer ? (
            <>
              <div>
                <p className="text-sm text-gray-500">Total Spend</p>
                <p className="font-medium">{formatToINR(totalSpend?.toFixed(2))}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Order Value</p>
                <p className="font-medium">{formatToINR(avgOrderValue?.toFixed(2))}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Orders</p>
                <p className="font-medium">{orderCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Purchase</p>
                <p className="font-medium">{lastPurchaseDate ? formatDateAndTime(lastPurchaseDate) : 'N/A'}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
            </>
          )}
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Customer Info</h3>
        <div className="space-y-2">
          {customer ? (
            <>
              <p className="text-sm">
                <span className="text-gray-500">Phone:</span> {customer?.phone || 'N/A'}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Address:</span> {customer?.address ? `${customer?.address?.street}, ${customer?.address?.city}, ${customer?.address?.state} ${customer?.address?.zipCode}, ${customer?.address?.country}` : 'N/A'}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Customer Since:</span> {customer?.createdAt ? formatDate(customer.createdAt) : 'N/A'}
              </p>
            </>
          ) : (
            <>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
            </>
          )}
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Recent Orders</h3>
        <ul className="space-y-2">
          {customer ? (
            recentOrders?.map((order, index) => (
              <li key={index} className="text-sm">
                <span className="text-gray-500">{convertDateFormat(order?.date)}:</span> {formatToINR(order?.amount?.toFixed(2))}
              </li>
            ))
          ) : (
            Array(3)
              .fill('')
              .map((_, index) => (
                <li key={index} className="w-full h-4 bg-gray-300 rounded"></li>
              ))
          )}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Notes</h3>
        {customer ? (
          <p className="text-sm">{customer?.settings?.find(s => s.key === 'notes')?.value || 'No notes available.'}</p>
        ) : (
          <div className="w-full h-4 bg-gray-300 rounded"></div>
        )}
      </section>
    </div>
  </CardContent>
  <CardFooter>
   {!customer &&  <p className="text-destructive">click any customer to see their stats</p>}
  </CardFooter>
</Card>


          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
