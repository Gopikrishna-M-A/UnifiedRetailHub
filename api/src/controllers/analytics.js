import Analytics from '../models/analytics.js'


export const createAnalytics = async (req, res) => {
  try {
    const newAnalyticsEvent = new Analytics(req.body);
    await newAnalyticsEvent.save();
    res.status(201).json(newAnalyticsEvent);
  } catch (error) {
    console.error('Error creating analytics event:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}
 




export const getAllAnalytics = async (req, res) => {
  try {
    const userId = req.params.userId;
    const analyticsEvents = await Analytics.find({ user: userId });
    res.json(analyticsEvents);
  } catch (error) {
    console.error('Error getting analytics events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}




export const getAnalytics = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const analyticsEvent = await Analytics.findById(eventId);

    if (!analyticsEvent) {
      return res.status(404).json({ error: 'Analytics event not found' });
    }

    res.json(analyticsEvent);
  } catch (error) {
    console.error('Error getting analytics event by eventId:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   




export const updateAnalytics = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const updatedAnalyticsEvent = await Analytics.findByIdAndUpdate(eventId, req.body, {
      new: true,
    });

    if (!updatedAnalyticsEvent) {
      return res.status(404).json({ error: 'Analytics event not found' });
    }

    res.json(updatedAnalyticsEvent);
  } catch (error) {
    console.error('Error updating analytics event by eventId:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}  




export const deleteAnalytics = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const deletedAnalyticsEvent = await Analytics.findByIdAndDelete(eventId);

    if (!deletedAnalyticsEvent) {
      return res.status(404).json({ error: 'Analytics event not found' });
    }

    res.json({ message: 'Analytics event deleted successfully' });
  } catch (error) {
    console.error('Error deleting analytics event by eventId:', error);
    res.status(400).json({ error: 'Bad request' });
  }
}   
