require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Models
const User = require('./Users');
const Movie = require('./Movies');

const authJwtController = require('./auth_jwt');

const app = express();

// --- 1. Middleware Setup ---
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- 3. Setup Express Router ---
const router = express.Router();

// ========== SIGNUP ROUTE ==========
router.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ success: false, msg: 'Please include username and password.' });
  }

  try {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });

    await user.save();
    return res
      .status(201)
      .json({ success: true, msg: 'Successfully created new user.' });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate username
      return res
        .status(409)
        .json({ success: false, message: 'User already exists.' });
    } else {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }
  }
});

// ========== SIGNIN ROUTE ==========
router.post('/signin', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ success: false, msg: 'Please include username and password.' });
  }

  try {
    // Make sure User schema has a comparePassword method if you're hashing
    const user = await User.findOne({ username: req.body.username }).select(
      'name username password'
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: 'Authentication failed. Wrong password.' });
    }

    // Create JWT
    const userToken = { id: user._id, username: user.username };
    const token = jwt.sign(userToken, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({ success: true, token: 'JWT ' + token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error.' });
  }
});

// ========== MOVIE ROUTES ==========
// GET all movies
router.get('/movies', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const movies = await Movie.find({});
    return res.json({ success: true, data: movies });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST a new movie
router.post('/movies', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const { title, releaseDate, genre, actors } = req.body;

    // Validate required fields
    if (!title || !releaseDate || !genre || !actors || actors.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields.' });
    }

    const newMovie = new Movie({ title, releaseDate, genre, actors });
    await newMovie.save();
    return res.status(201).json({ success: true, data: newMovie });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET a movie by title
router.get('/movies/:title', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    return res.json({ success: true, data: movie });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE a movie by title
router.put('/movies/:title', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { title: req.params.title },
      req.body,
      { new: true }
    );
    if (!updatedMovie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    return res.json({ success: true, data: updatedMovie });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a movie by title
router.delete('/movies/:title', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const deletedMovie = await Movie.findOneAndDelete({ title: req.params.title });
    if (!deletedMovie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    return res.json({ success: true, message: 'Movie deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ========== APPLY ROUTER ==========
app.use('/', router);

// ========== START SERVER ==========
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for testing only
