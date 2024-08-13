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
  billingAddress: {
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
},
{
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

export default mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

