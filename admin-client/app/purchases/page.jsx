"use client"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import axios from "axios"
import { convertDateFormat, formatToINR } from "@/lib/formats"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [purchases, setPurchases] = useState([])
  const [vendors, setVendors] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

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

  const handleDeleteVendor = async (id) => {
    try {
      await axios.delete(`/api/vendors?id=${id}`)
      toast({
        description: "Vendor deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete:", error)
      toast({
        variant: "destructive",
        title: "Failed to delete vendor. Please try again.",
        description: "There was a problem with your request.",
      })
    }
  }

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
            <Link href='/purchases/order'>
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add Bill
              </span>
            </Button>
            </Link>
            
           <Link href='/purchases/vendor/new'> <Button size='sm' variant='secondary' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Add Vendor
              </span>
            </Button></Link>
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
                            <Link href={`/purchases/vendor/${vendor._id}`}>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>
                            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(event) => {
                                    event.preventDefault()
                                    setIsOpen(true)
                                  }}>
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the selected item.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    onClick={() => setIsOpen(false)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteVendor(vendor._id)
                                    }>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
