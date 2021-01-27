const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const topicsRoutes = require('./routes/topics.route');
const coursesRoutes = require('./routes/courses.route');
const usersRoutes = require('./routes/users.route');
const problemsRoutes = require('./routes/problems.route');
const app = express();

mongoose.connect("mongodb+srv://willow_sap:" +
  "cDqE5KQ5WA5D3e8Q" + 
  "@cluster0-kj1mw.mongodb.net/sapphire-cs?retryWrites=true&w=majority"
).then(() => {
  console.log("connected to database");
}).catch(() => {
  console.log("connection failed");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use('/images', express.static(path.join('backend/images')));
app.use(express.static(__dirname + '/angular'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'Originm X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/problems', problemsRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/users', usersRoutes);
app.use('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'angular', 'index.html'))
})

module.exports = app;