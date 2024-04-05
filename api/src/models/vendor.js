import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  primaryContact: {
    firstName:String,
    lastName:String
  },
  companyName: String,
  displayName: String,
  email: String,
  phone: String,
  PAN: String,
  MSME: Boolean,
  registrationType: String,
  registrationNumber: String,
  currency: String,
  paymentTerms: String,
  website: String,
  department: String,
  Facebook: String,
  Twitter: String,
  billingAddress: {
    Attention: String,
    country: String,
    Address: String,
    city: String,
    state: String,
    zipCode: String,
    Phone: String,
  },
  shippingAddress: {
    Attention: String,
    country: String,
    Address: String,
    city: String,
    state: String,
    zipCode: String,
    Phone: String,
  },
  contactPersons: [
    {
      Salutation: String,
      firstName: String,
      firstName: String,
      lastName: String,
      Email: String,
      workPhone: String,
      Mobile: String,
    },
  ],
  bankDetails: [
    {
      beneficiaryName: String,
      bankName: String,
      accountNumber: String,
      IFSC: String,
    },
  ],
  remarks:String
});

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;

