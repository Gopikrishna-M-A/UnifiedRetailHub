import Banner from '../models/banners.js'


export const createBanner = async (req, res) => {
  try {
    const newBanner = new Banner(req.body);
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    console.error('Error getting banners:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   




export const getBanner = async (req, res) => {
  try {
    const bannerId = req.params.bannerId;
    const banner = await Banner.findById(bannerId);
    
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    
    res.json(banner);
  } catch (error) {
    console.error('Error getting banner by ID:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const updateBanner = async (req, res) => {
  try {
    const bannerId = req.params.bannerId;
    const updatedBanner = await Banner.findByIdAndUpdate(bannerId, req.body, {
      new: true,
    });

    if (!updatedBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    
    res.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner by ID:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.params.bannerId;
    const deletedBanner = await Banner.findByIdAndDelete(bannerId);

    if (!deletedBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner by ID:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   
