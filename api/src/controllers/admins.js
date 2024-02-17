import Admin from '../models/admin.js'


export const getAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error getting admin by ID:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   




export const createAdmin = async (req, res) => {
  try {
    // Implement the logic to create a new admin here
    // You'll need to validate input, hash the password, and save the admin
    
    // Once the admin is created successfully, return the admin details
    res.json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // Implement the logic to update the admin based on the request data
    // You may want to validate input and handle password updates separately
    
    // Once the admin is updated successfully, return the updated admin details
    res.json({ message: 'Admin updated successfully' });
  } catch (error) {
    console.error('Error updating admin by ID:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const removeAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    
    // Implement the logic to remove the admin by ID
    // You may want to add validation and confirmation steps
    
    res.json({ message: 'Admin removed successfully' });
  } catch (error) {
    console.error('Error removing admin by ID:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}   
