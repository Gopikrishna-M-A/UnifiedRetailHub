import React, { useEffect, useState } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

const EditCategory = ({ categories, id }) => {
    const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    parentCategory: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`api/categories?id=${id}`)
        setCategoryName(res.data.name)
        setCategoryDescription(res.data.description)
        setParentCategory(res.data.parentCategory)
      } catch (error) {
        console.error("Error fetching category data:", error)
        toast({
          variant: "destructive",
          title: "Failed to fetch category data",
          description: "There was a problem retrieving the category information.",
        })
      }
    }
    fetchData()
  }, [id, toast])

  const editCategory = async () => {
    try {
      const data = {
        name: categoryName,
        description: categoryDescription,
        ...(parentCategory && { parentCategory }),
      }
      await axios.patch(`/api/categories?id=${id}`, data)
      toast({
        description: "Category updated successfully",
      })
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        variant: "destructive",
        title: "Failed to update category. Please try again.",
        description: "There was a problem with your request.",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full h-full text-left">
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Edit the details below to update the category.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Input
              value={categoryName}
              onChange={handleInputChange}
              placeholder='Category name'
            />
            <Textarea
              value={categoryDescription}
              onChange={handleInputChange}
              placeholder='Category description'
            />
            <Select
              value={parentCategory}
              onValueChange={(value) => setParentCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Parent Category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button type='button' onClick={editCategory}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditCategory