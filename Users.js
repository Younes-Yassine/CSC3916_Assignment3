const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Connect to MongoDB using the connection string from .env
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB (Users)");
  } catch (error) {
    console.error("MongoDB connection error (Users):", error);
    process.exit(1); // Exit if connection fails
  }
};

connectDB();

// Define the User schema
const UserSchema = new Schema({
  name: String,
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true, select: false } // select: false hides the password by default
});

// Before saving, hash the password if it has been modified
UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const hash = await bcrypt.hash(user.password, 10); 
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Compare a candidate password with the hashed password
UserSchema.methods.comparePassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema);
