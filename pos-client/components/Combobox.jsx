"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEmployee } from "@/contexts/EmployeeContext"

const employees = [
  {
    value: "john-doe",
    label: "John Doe",
    password: "1234"
  },
  {
    value: "jane-smith",
    label: "Jane Smith",
    password: "5678"
  },
  {
    value: "mike-johnson",
    label: "Mike Johnson",
    password: "9012"
  },
  {
    value: "emily-brown",
    label: "Emily Brown",
    password: "3456"
  },
  {
    value: "chris-wilson",
    label: "Chris Wilson",
    password: "7890"
  },
]

export default function EmployeeSelector() {
  const [open, setOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedEmployee, setSelectedEmployee] = React.useState(null)
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const { currentEmployee, setCurrentEmployee } = useEmployee()

  const handleEmployeeSelect = (currentValue) => {
    const employee = employees.find(emp => emp.value === currentValue)
    setSelectedEmployee(employee)
    setDialogOpen(true)
    setPassword("")
    setError("")
  }

  const handlePasswordSubmit = () => {
    if (selectedEmployee && password === selectedEmployee.password) {
      setCurrentEmployee(selectedEmployee)
      setOpen(false)
      setDialogOpen(false)
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {currentEmployee
              ? currentEmployee.label
              : "Select employee..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search employee..." />
            <CommandList>
              <CommandEmpty>No employee found.</CommandEmpty>
              <CommandGroup>
                {employees.map((employee) => (
                  <CommandItem
                    key={employee.value}
                    value={employee.value}
                    onSelect={handleEmployeeSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentEmployee?.value === employee.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {employee.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
            <DialogDescription>
              Please enter the password for {selectedEmployee?.label}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handlePasswordSubmit}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}