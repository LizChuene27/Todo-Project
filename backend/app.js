// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');


// Create an Express app
const app = express();
const port = process.env.PORT || 8000;


// Connect to MongoDB
const MONGODB_URI = 'mongodb+srv://LizChuene27:mondesa@cluster0.wt2dlzb.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

// Define your routes here
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
// Start the server
app.listen(8000, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = app