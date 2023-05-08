const mongoose = require('mongoose');

// Define the City schema
const citySchema = new mongoose.Schema({
  name: String,
  country: String,
});

// Define the User schema with a reference to City
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
});

// Create the City model
const City = mongoose.model('City', citySchema);

// Create the User model
const User = mongoose.model('User', userSchema);

// Create a City document
const cityData = {
  name: 'New York',
  country: 'USA',
};

// Save the City document to the database
const city = await City.create(cityData);

// Create a User document with a reference to the City document
const userData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  city: city._id, // Reference to the City document
};

// Save the User document to the database
const user = await User.create(userData);

// Use aggregation to pull data and populate the referenced City
const result = await User.aggregate([
  {
    $lookup: {
      from: 'cities', // Name of the City collection
      localField: 'city',
      foreignField: '_id',
      as: 'cityData',
    },
  },
  {
    $unwind: '$cityData',
  },
  {
    $project: {
      _id: 1,
      name: 1,
      email: 1,
      'cityData.name': 1,
      'cityData.country': 1,
    },
  },
]);

console.log(result);
