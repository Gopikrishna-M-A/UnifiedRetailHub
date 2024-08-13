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
import { convertDateFormat, formatToINR, getInitials } from "@/lib/formats"

export default function Dashboard() {
  const [purchases, setPurchases] = useState([])
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    const getPurchases = async () => {
      const res = await axios.get("/api/purchases")
      setPurchases(res.data.purchases)
    }
    const getVendors = async () => {
      const res = await axios.get("/api/vendors")
      setVendors(res.data.vendors)
      console.log("vendors",res.data.vendors);
    }
    getVendors()
    getPurchases()
  }, [])

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <Tabs defaultValue='vendors'>
        <div className='flex items-center'>
          <TabsList>
            <TabsTrigger value='vendors'>Vendors</TabsTrigger>
            <TabsTrigger value='orders'>Orders</TabsTrigger>
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
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add Bill
              </span>
            </Button>
            <Button size='sm' variant='secondary' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add Vendor
              </span>
            </Button>
          </div>
        </div>

        <TabsContent value='vendors'>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader>
              <CardTitle>Vendors</CardTitle>
              <CardDescription>
                Manage your vendors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden lg:table-cell">Company Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                    <TableHead>Payables</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>
                      <span className='sr-only'>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors?.map((vendor) => (
                    <TableRow>
                      <TableCell className='font-medium'>
                        {vendor?.displayName}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {vendor?.companyName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {vendor?.email}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {vendor?.phone}
                      </TableCell>
                      <TableCell>
                        {formatToINR(0)}
                      </TableCell>
                      <TableCell>
                        {formatToINR(0)}
                      </TableCell>
                     
                      
                      <TableCell>
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
                      </TableCell>
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
        </TabsContent>





        <TabsContent value='orders'>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                Manage your purchase orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill No</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Due</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Terms</TableHead>
                    <TableHead className="hidden md:table-cell">Total</TableHead>
                    <TableHead className="hidden lg:table-cell">Balance</TableHead>
                    <TableHead>
                      <span className='sr-only'>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases?.map((purchase) => (
                    <TableRow>
                      <TableCell>
                        #{purchase?.billNumber}
                      </TableCell>
                      <TableCell className='font-medium hidden lg:table-cell'>
                        {convertDateFormat(purchase?.billDate)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {convertDateFormat(purchase?.dueDate)}
                      </TableCell>
                      <TableCell>
                        {purchase?.vendor?.displayName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{purchase?.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {purchase?.paymentTerms}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatToINR(purchase?.total)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatToINR(purchase?.balance)}
                      </TableCell>
                      
                      <TableCell>
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
                      </TableCell>
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
        </TabsContent>
      </Tabs>
    </main>
  )
}
