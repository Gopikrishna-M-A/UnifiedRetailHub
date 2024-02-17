import StaticPage from '../models/staticPages.js'


export const createStaticPage = async (req, res) => {
  try {
    const newStaticPage = new StaticPage(req.body);
    await newStaticPage.save();
    res.status(201).json(newStaticPage);
  } catch (error) {
    console.error('Error creating static page:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const getStaticPages = async (req, res) => {
  try {
    const staticPages = await StaticPage.find();
    res.json(staticPages);
  } catch (error) {
    console.error('Error getting static pages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   




export const getStaticPage = async (req, res) => {
  try {
    const slug = req.params.slug;
    const staticPage = await StaticPage.findOne({ slug });

    if (!staticPage) {
      return res.status(404).json({ error: 'Static page not found' });
    }

    res.json(staticPage);
  } catch (error) {
    console.error('Error getting static page by slug:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const updateStaticPage = async (req, res) => {
  try {
    const slug = req.params.slug;
    const updatedStaticPage = await StaticPage.findOneAndUpdate({ slug }, req.body, {
      new: true,
    });

    if (!updatedStaticPage) {
      return res.status(404).json({ error: 'Static page not found' });
    }

    res.json(updatedStaticPage);
  } catch (error) {
    console.error('Error updating static page by slug:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const deleteStaticPage = async (req, res) => {
  try {
    const slug = req.params.slug;
    const deletedStaticPage = await StaticPage.findOneAndDelete({ slug });

    if (!deletedStaticPage) {
      return res.status(404).json({ error: 'Static page not found' });
    }

    res.json({ message: 'Static page deleted successfully' });
  } catch (error) {
    console.error('Error deleting static page by slug:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   
