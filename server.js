'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection'); // This is the 'main' function
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const pug = require('pug');
const app = express();

// Set up Pug
app.set('view engine', 'pug');
app.set('views', './views/pug');

// Middleware for FCC testing and static files
fccTesting(app); // For fCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database first, then start the server
myDB(async client => {
  // Pass the MongoDB client to fccTesting if it needs it (it likely will for later challenges)
  // Or, if fccTesting doesn't need the client directly, you can just proceed
  // For now, let's assume fccTesting doesn't need the client directly for the first few steps.
  // Later, you'll pass the client or the db object to your authentication routes.

  // This is your root route, which should render the Pug template
  app.route('/').get((req, res) => {
    res.render('index', { title: 'FCC Advanced Node and Express' }); // Ensure title is passed
  });

  // Set up your routes here that depend on the database
  // Example: require('./routes/auth.js')(app, client.db('your_db_name')); // Replace 'your_db_name'

  // Start the server only after successful database connection
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log('Database connected and server running!'); // Confirm DB connection
  });
}).catch(e => {
  // Handle database connection errors gracefully
  app.route('/').get((req, res) => {
    res.render('index', { title: 'Error', message: 'Unable to connect to database. Please check MONGO_URI.' });
  });
  console.error('Failed to connect to database:', e);
});