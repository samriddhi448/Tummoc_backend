// Import required modules
const express = require('express');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const { Strategy: JWTStrategy, ExtractJwt } = passportJWT;

// Create the Express app
const app = express();

// Configure passport
app.use(passport.initialize());

// Configure the JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'yourSecretKey', // Replace with your own secret key
};

// Define the JWT strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
      callbackURL: 'YOUR_CALLBACK_URL',
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle the authenticated user profile data
      // Create or update the user session data
      console.log(profile);
    }
  )
);

// Middleware for user authentication
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect or respond with a success message
    res.redirect('/');
  }
);

// Sample User model using mongoose
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Route for user login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if the username and password are valid
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, jwtOptions.secretOrKey);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for a protected resource
app.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'Protected resource' });
});

// Route for user logout (token expiration)
app.post('/logout', (req, res) => {
  // You can implement your own logic here to invalidate or blacklist the token
  // For example, you can store the token in the database and mark it as expired
  // Here, we'll simply respond with a success message
  return res.json({ message: 'Logout successful' });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
