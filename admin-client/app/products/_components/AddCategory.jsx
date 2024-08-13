import React, { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

const AddCategory = ({ categories }) => {
  const [categoryName, setCategoryName] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [parentCategory, setParentCategory] = useState("")
  const { toast } = useToast()

  const addNewCategory = async () => {
    try {
      const data = {
        name: categoryName,
        description: categoryDescription,
        ...(parentCategory && { parentCategory }),
      }
      await axios.post("/api/categories", data)
      toast({
        description: "Category added successfully",
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        variant: "destructive" ,
        title: "Failed to add category. Please try again.",
        description: "There was a problem with your request.",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary' size='sm' className='h-8 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            Add Category
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Enter the details below to add a new category.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Input
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder='Category name'
            />
            <Textarea
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder='Category description'
            />
            <Select
              onValueChange={(e) => {
                setParentCategory(e)
              }}>
              <SelectTrigger>
                <SelectValue placeholder='Parent Category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button type='button' onClick={addNewCategory}>
              Add Category
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddCategory
