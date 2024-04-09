// import { Button } from "../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";
// import { CalendarDateRangePicker } from "../../components/dashboard/date-range-picker";
// import { Overview } from "../../components/dashboard/overview";
// import { RecentSales } from "../../components/dashboard/recent-sales";

// import Vendors from '../../components/purchase/Vendors'
// import OrderManagement from '../../components/purchase/OrderManagement'
import AddBill from '../../../components/purchase/AddBill'

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Bill</h2>
        {/* <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button>Download</Button>
      </div> */}
      </div>
      <AddBill/>
    </div>
  );
}
