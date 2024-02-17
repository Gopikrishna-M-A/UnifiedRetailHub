import Category from '../models/categories.js'


export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parentCategory');
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   




export const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error getting category by ID:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   




export const createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category by ID:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}  




export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const deletedCategory = await Category.findByIdAndRemove(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category by ID:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   


