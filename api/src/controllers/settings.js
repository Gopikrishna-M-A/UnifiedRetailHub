import Settings from '../models/settings.js'


export const getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   
export const getSettingValue = async (req, res) => {
  try {
    const settingKey = req.params.settingKey;
    const setting = await Settings.findOne({ key: settingKey });
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.status(200).json(setting.value);
  } catch (error) {
    console.error('Error fetching setting value:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   
export const updateSettingValue = async (req, res) => {
  try {
    const settingKey = req.params.settingKey;
    const newValue = req.body.value; 
    
    const setting = await Settings.findOneAndUpdate(
      { key: settingKey },
      { value: newValue },
      { new: true } // This ensures that you get the updated setting in the response
    );

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.status(200).json(setting);
  } catch (error) {
    console.error('Error updating setting value:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   


