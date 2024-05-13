import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { CalendarDateRangePicker } from "../../components/dashboard/date-range-picker";
import { Overview } from "../../components/dashboard/overview";
import { RecentSales } from "../../components/dashboard/recent-sales";

import Vendors from '../../components/purchase/Vendors'
import OrderManagement from '../../components/purchase/OrderManagement'

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Purchases</h2>
        {/* <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button>Download</Button>
      </div> */}
      </div>
      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="order-management">Order Management</TabsTrigger>
          {/* <TabsTrigger value="bills">Vendor Payments</TabsTrigger> */}
          {/* <TabsTrigger value="vendor-credits">Vendor Credits</TabsTrigger> */}
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Vendors />
          </div>
        </TabsContent>


        <TabsContent value="order-management" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <OrderManagement />
          </div>
        </TabsContent>
    {/* 
        <TabsContent value="Vendors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>``
        </TabsContent>

        <TabsContent value="Vendors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          </div>
        </TabsContent> */}

      </Tabs>
    </div>
  );
}
