import mongoose from 'mongoose'
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
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
});



userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};


const User = mongoose.model('User', userSchema);

export default User;
