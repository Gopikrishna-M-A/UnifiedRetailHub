import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart, Package, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { formatToINR } from '@/lib/formats';

import { SaleChart1, SaleChart2, SaleChart3 } from '@/components/Charts';



export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatToINR(45231.89)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SaleChart1/>
          <SaleChart2/>
          <SaleChart3/>

          </div>
 
      

      {/* Recent Orders and Top Products */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">
                      2 items • &nbsp;
                      {formatToINR((Math.random() * 100).toFixed(2))}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {['Product A', 'Product B', 'Product C'].map((product, i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{product}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 100)} units sold
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {formatToINR((Math.random() * 1000).toFixed(2))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>
            <Package className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" /> View Reports
          </Button>
          <Button>
            <Users className="mr-2 h-4 w-4" /> Manage Employees
          </Button>
          <Button variant="secondary">
            <AlertCircle className="mr-2 h-4 w-4" /> View Alerts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}