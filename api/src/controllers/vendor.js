import Vendor from '../models/vendor.js'

export const addVendor = async (req, res) => {

  const newVendor = new Vendor(req.body);

  try {
    await newVendor.save();
    res.status(201).json(newVendor);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


export const getVendor = async (req, res) => {
  try {
    const Vendor = await Vendor.findById(req.params.id);
    res.status(200).json(Vendor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const Vendors = await Vendor.find();
    res.status(200).json(Vendors);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

}

export const deleteVendor = async (req, res) => {
  const { id } = req.params;
  try {
    await Vendor.findByIdAndRemove(id);
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendor = async (req, res) => {
  const { id } = req.params;
  const updatedVendor = req.body;
  try {
    const result = await Vendor.findByIdAndUpdate(id, updatedVendor, { new: true });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
