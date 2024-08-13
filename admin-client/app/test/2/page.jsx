"use client"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import axios from "axios"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function Dashboard({ params }) {
  const id = params.id
  const isEditMode = id !== "new"
  const router = useRouter()

  const [vendor, setVendor] = useState({
    primaryContact: { firstName: "", lastName: "" },
    companyName: "",
    displayName: "",
    email: "",
    phone: "",
    PAN: "",
    MSME: false,
    registrationType: "",
    registrationNumber: "",
    currency: "",
    paymentTerms: "",
    website: "",
    department: "",
    Facebook: "",
    Twitter: "",
    billingAddress: {
      country: "",
      Address: "",
      city: "",
      state: "",
      zipCode: "",
      Phone: "",
    },
    shippingAddress: {
      Attention: "",
      country: "",
      Address: "",
      city: "",
      state: "",
      zipCode: "",
      Phone: "",
    },
    contactPersons: [],
    bankDetails: [],
    remarks: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseRes] = await Promise.all([
          isEditMode
            ? axios.get(`/api/vendors?id=${id}`)
            : Promise.resolve({ data: null }),
          axios.get("/api/vendors"),
        ])

        setVendor(purchaseRes.data)
        console.log(purchaseRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Failed to fetch data",
          description: "There was a problem with your request.",
        })
      }
    }
    fetchData()
  }, [isEditMode])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      if (isEditMode) {
        await axios.patch(`/api/vendors?id=${params.id}`, product)
      } else {
        await axios.post("/api/vendors", product)
      }
      toast({
        description: `Vendor ${
          isEditMode ? "updated" : "created"
        } successfully`,
      })
    } catch (error) {
      console.error("Error saving vendor:", error)
      toast({
        variant: "destructive",
        title: `Failed to ${isEditMode ? "update" : "create"} vendor`,
        description: "There was a problem with your request.",
      })
    }
    setIsLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleNestedInputChange = (parent, field, value) => {
    setProduct((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }))
  }

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'>
        <div className='flex items-center gap-4'>
          <Link href='/purchases'>
            <Button variant='outline' size='icon' className='h-7 w-7'>
              <ChevronLeft className='h-4 w-4' />
              <span className='sr-only'>Back</span>
            </Button>
          </Link>
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
            {isEditMode ? "Edit Vendor" : "Add New Vendor"}
          </h1>

          <div className='hidden items-center gap-2 md:ml-auto md:flex'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push("/purchases")}>
              Discard
            </Button>
            <Button size='sm' onClick={handleSave} disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Update Vendor"
                : "Create Vendor"}
            </Button>
          </div>
        </div>
        <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
          <div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
            <Card x-chunk='dashboard-07-chunk-0'>
              <CardHeader>
                <CardTitle>Primary Information</CardTitle>
                <CardDescription>
                  Provide the essential details for adding a new vendor to the
                  system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='grid gap-3'>
                      <Label htmlFor='firstName'>First Name</Label>
                      <Input
                        placeholder='Rahul'
                        id='firstName'
                        name='firstName'
                        type='text'
                        value={vendor.primaryContact.firstName}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "primaryContact",
                            "firstName",
                            e.target.value
                          )
                        }
                        className='w-full'
                      />
                    </div>
                    <div className='grid gap-3'>
                      <Label htmlFor='lastName'>Last Name</Label>
                      <Input
                        placeholder='Sharma'
                        id='lastName'
                        name='lastName'
                        type='text'
                        value={vendor.primaryContact.lastName}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "primaryContact",
                            "lastName",
                            e.target.value
                          )
                        }
                        className='w-full'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='grid gap-3'>
                      <Label htmlFor='companyName'>Company Name</Label>
                      <Input
                        placeholder='Tech Solutions Pvt Ltd'
                        id='companyName'
                        name='companyName'
                        type='text'
                        value={vendor.companyName}
                        onChange={handleInputChange}
                        className='w-full'
                      />
                    </div>
                    <div className='grid gap-3'>
                      <Label htmlFor='displayName'>Display Name</Label>
                      <Input
                        placeholder='Tech Solutions'
                        id='displayName'
                        name='displayName'
                        type='text'
                        value={vendor.companyName}
                        onChange={handleInputChange}
                        className='w-full'
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='grid gap-3'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        placeholder='rahul.sharma@techsolutions.com'
                        id='email'
                        name='email'
                        type='text'
                        value={vendor.email}
                        onChange={handleInputChange}
                        className='w-full'
                      />
                    </div>
                    <div className='grid gap-3'>
                      <Label htmlFor='phone'>Phone</Label>
                      <Input
                        placeholder='+91 98765 43210'
                        id='phone'
                        name='phone'
                        type='text'
                        value={vendor.phone}
                        onChange={handleInputChange}
                        className='w-full'
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk='dashboard-07-chunk-1'>
              <CardHeader>
                <CardTitle>Contact Person</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid grid-cols-5 gap-4'>
                    <div className='grid col-span-1 gap-3'>
                      <Label htmlFor='salutation'>Salutation</Label>
                      <Select
                        value={vendor?.primaryContact?.salutation}
                        defaultValue='Mr'
                        onValueChange={(value) =>
                          handleNestedInputChange(
                            "primaryContact",
                            "salutation",
                            value
                          )
                        }>
                        <SelectTrigger id='salutation'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Mr'>Mr.</SelectItem>
                          <SelectItem value='Ms'>Ms.</SelectItem>
                          <SelectItem value='Mrs'>Mrs.</SelectItem>
                          <SelectItem value='Dr'>Dr.</SelectItem>
                          <SelectItem value='Prof'>Prof.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid col-span-2 gap-3'>
                      <Label htmlFor='firstName'>First Name</Label>
                      <Input
                        placeholder='John'
                        id='firstName'
                        name='firstName'
                        type='text'
                        value={vendor?.primaryContact?.firstName}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "primaryContact",
                            "firstName",
                            value
                          )
                        }
                      />
                    </div>

                    <div className='grid col-span-2 gap-3'>
                      <Label htmlFor='lastName'>Last Name</Label>
                      <Input
                        placeholder='Doe'
                        id='lastName'
                        name='lastName'
                        type='text'
                        value={vendor?.primaryContact?.lastName}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "primaryContact",
                            "lastName",
                            value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className='grid gap-3'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      placeholder='john.doe@example.com'
                      id='email'
                      name='email'
                      type='email'
                      value={vendor?.primaryContact?.email}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "primaryContact",
                          "email",
                          value
                        )
                      }
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='grid gap-3'>
                      <Label htmlFor='workPhone'>Work Phone</Label>
                      <Input
                        placeholder='+91 234 567 8901'
                        id='workPhone'
                        name='workPhone'
                        type='tel'
                        value={vendor?.primaryContact?.workPhone}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "primaryContact",
                            "workPhone",
                            value
                          )
                        }
                      />
                    </div>

                    <div className='grid gap-3'>
                      <Label htmlFor='mobile'>Mobile</Label>
                      <Input
                        placeholder='+91 987 654 3210'
                        id='mobile'
                        name='mobile'
                        type='tel'
                        value={vendor?.primaryContact?.mobile}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "primaryContact",
                            "mobile",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card x-chunk='dashboard-07-chunk-2'>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div>
                    <Label htmlFor='billingCountry'>Country</Label>
                    <Input
                      id='billingCountry'
                      placeholder='India'
                      value={vendor.billingAddress.country}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "billingAddress",
                          "country",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='billingAddress'>Address</Label>
                    <Textarea
                      placeholder='123 Main St, Apt 4B'
                      id='billingAddress'
                      value={vendor.billingAddress.Address}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "billingAddress",
                          "Address",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='billingCity'>City</Label>
                      <Input
                        placeholder='Ernakulam'
                        id='billingCity'
                        value={vendor.billingAddress.city}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingAddress",
                            "city",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='billingState'>State</Label>
                      <Input
                        id='billingState'
                        placeholder='Kerala'
                        value={vendor.billingAddress.state}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingAddress",
                            "state",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='billingZipCode'>Zip Code</Label>
                      <Input
                        placeholder='10001'
                        id='billingZipCode'
                        value={vendor.billingAddress.zipCode}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingAddress",
                            "zipCode",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='billingPhone'>Phone</Label>
                      <Input
                        id='billingPhone'
                        placeholder='+91 234 567 8901'
                        value={vendor.billingAddress.Phone}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "billingAddress",
                            "Phone",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='currency'>Currency</Label>
                    <Select
                      value={vendor.currency}
                      defaultValue='INR'
                      onValueChange={(value) =>
                        setVendor((prev) => ({ ...prev, currency: value }))
                      }>
                      <SelectTrigger id='currency'>
                        <SelectValue placeholder='Select currency' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='INR'>Indian Rupee (INR)</SelectItem>
                        <SelectItem value='USD'>US Dollar (USD)</SelectItem>
                        <SelectItem value='EUR'>Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid gap-3'>
                    <Label htmlFor='paymentTerms'>Payment Terms</Label>

                    <Select
                      value={vendor.paymentTerms}
                      onValueChange={(e) => {
                        setVendor((prev) => ({ ...prev, paymentTerms: value }))
                      }}>
                      <SelectTrigger id='paymentTerms'>
                        <SelectValue placeholder='Select payment terms' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='net-15'>Net 15</SelectItem>
                        <SelectItem value='net-30'>Net 30</SelectItem>
                        <SelectItem value='net-45'>Net 45</SelectItem>
                        <SelectItem value='net-60'>Net 60</SelectItem>
                        <SelectItem value='month-end'>
                          Due end of the month
                        </SelectItem>
                        <SelectItem value='next-month-end'>
                          Due end of next month
                        </SelectItem>
                        <SelectItem value='receipt'>Due on receipt</SelectItem>
                        <SelectItem value='custom'>Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card x-chunk='dashboard-07-chunk-4'>
              <CardHeader>
                <CardTitle>Registration Details</CardTitle>
                <CardDescription>
                  Essential business registration credentials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='isFeatured'
                      checked={vendor?.MSME}
                      onCheckedChange={(checked) =>
                        setVendor((prev) => ({ ...prev, MSME: checked }))
                      }
                    />
                    <Label htmlFor='isFeatured'>MSME Registered</Label>
                  </div>

                  <div className='grid gap-3'>
                    <Label htmlFor='PAN'>PAN</Label>
                    <Input
                      placeholder='ABCDE1234F'
                      id='PAN'
                      name='PAN'
                      type='text'
                      value={vendor.PAN}
                      onChange={handleInputChange}
                      className='w-full'
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='registrationType'>Registration Type</Label>
                    <Select
                      value={vendor.registrationType}
                      onValueChange={(value) =>
                        setVendor((prev) => ({
                          ...prev,
                          registrationType: value,
                        }))
                      }>
                      <SelectTrigger id='registrationType'>
                        <SelectValue placeholder='Select registration type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='individual'>Individual</SelectItem>
                        <SelectItem value='company'>Company</SelectItem>
                        <SelectItem value='partnership'>Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='registrationNumber'>
                      Registration Number
                    </Label>
                    <Input
                      placeholder='XYZ1234567890'
                      type='text'
                      id='registrationNumber'
                      name='registrationNumber'
                      value={vendor.registrationNumber}
                      onChange={handleInputChange}
                      className='w-full'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card x-chunk='dashboard-07-chunk-3'>
              <CardHeader>
                <CardTitle>Bank Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <Label htmlFor='beneficiaryName'>Beneficiary Name</Label>
                    <Input
                      placeholder='John Doe'
                      id='beneficiaryName'
                      name='beneficiaryName'
                      type='text'
                      value={vendor?.bankDetails?.beneficiaryName}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "bankDetails",
                          "beneficiaryName",
                          value
                        )
                      }
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='bankName'>Bank Name</Label>
                    <Input
                      placeholder='State Bank of India'
                      id='bankName'
                      name='bankName'
                      type='text'
                      value={vendor?.bankDetails?.bankName}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "bankDetails",
                          "bankName",
                          value
                        )
                      }
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='accountNumber'>Account Number</Label>
                    <Input
                      placeholder='123456789012'
                      id='accountNumber'
                      name='accountNumber'
                      type='text'
                      value={vendor?.bankDetails?.accountNumber}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "bankDetails",
                          "accountNumber",
                          value
                        )
                      }
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='IFSC'>IFSC Code</Label>
                    <Input
                      placeholder='SBIN0001234'
                      id='IFSC'
                      name='IFSC'
                      type='text'
                      value={vendor?.bankDetails?.IFSC}
                      onChange={(e) =>
                        handleNestedInputChange("bankDetails", "IFSC", value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className='flex items-center justify-center gap-2 md:hidden'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.push("/purchases")}>
            Discard
          </Button>
          <Button size='sm'>
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Update Vendor"
              : "Create Vendor"}
          </Button>
        </div>
      </div>
    </main>
  )
}
