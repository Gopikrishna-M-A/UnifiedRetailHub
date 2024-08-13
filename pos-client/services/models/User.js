import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  oAuthId: {
    type: String,
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  settings: [{
    key: {
      type: String,
    },
    value: mongoose.Schema.Types.Mixed,
  }],
  posUser:{
    type:Boolean
  }
},
{
  timestamps: true, // Automatically add createdAt and updatedAt fields
}
);

export default mongoose.models.User || mongoose.model('User', UserSchema);