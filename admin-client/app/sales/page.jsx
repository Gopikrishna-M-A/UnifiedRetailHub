import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import { CalendarDateRangePicker } from "../../components/dashboard/date-range-picker"
import { Overview } from "../../components/dashboard/overview"
import { RecentSales } from "../../components/dashboard/recent-sales"

import Customers from "../../components/sales/Customers"
import Orders from "../../components/sales/Orders"




export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        {/* <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button>Download</Button>
      </div> */}
      </div>
      <Tabs defaultValue="Customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="Customers">Customers</TabsTrigger>
          <TabsTrigger value="orders" >orders</TabsTrigger>
          {/* <TabsTrigger value="Invoices" >Invoices</TabsTrigger>
          <TabsTrigger value="payments-received" >payments received</TabsTrigger>
          <TabsTrigger value="packages" >packages</TabsTrigger>
          <TabsTrigger value="Shipments" >Shipments</TabsTrigger>
          <TabsTrigger value="Returns" >Returns</TabsTrigger>
          <TabsTrigger value="Credit-notes" >Credit notes</TabsTrigger>
          <TabsTrigger value="Conflicts" >Conflicts</TabsTrigger> */}

        </TabsList>
        <TabsContent value="Customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Customers />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Orders />
          </div>
        </TabsContent>

        <TabsContent value="Invoices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>
        </TabsContent>

        <TabsContent value="payments-received" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>
        </TabsContent>

        <TabsContent value="Shipments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>
        </TabsContent>

        <TabsContent value="Returns" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>
        </TabsContent>

        {/* <TabsContent value="Credit-notes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>
        </TabsContent> */}

        <TabsContent value="Conflicts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
