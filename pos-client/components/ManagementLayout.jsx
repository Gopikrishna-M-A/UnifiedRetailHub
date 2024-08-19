"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  ChevronDown,
  User,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Button } from "./ui/button"

const menuItems = [
  { name: "Dashboard", href: "/manage", icon: "dashboard" },
  { name: "Orders", href: "/manage/orders", icon: "receipt_long" },
  { name: "Products", href: "/manage/products", icon: "inventory_2" },
  { name: "Customers", href: "/manage/customers", icon: "group" },
  { name: "Reports", href: "/manage/reports", icon: "bar_chart" },
  { name: "Employees", href: "/manage/employees", icon: "badge" },
  { name: "Configuration", href: "/manage/config", icon: "settings" },
]

export default function ManagementLayout({ children }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen)

  return (
    <div className='flex h-screen bg-background text-foreground'>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-14"
        } bg-card shadow-md transition-all duration-300 ease-in-out`}>
        <nav className='mt-5 px-2'>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 my-1 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}>
              <span className='material-symbols-outlined mr-3'>
                {item.icon}
              </span>
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div className={`w-full flex py-2 ${isSidebarOpen ? 'justify-end px-2' : 'justify-center'}`}>
          <Button
            onClick={toggleSidebar}
            variant='outline'
            className='rounded-full'
            size='icon'>
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
          </Button>
        </div>
      </aside>

      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-5'>{children}</main>
      </div>
    </div>
  )
}
