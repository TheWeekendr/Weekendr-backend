'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Data = require('./data');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
db.once('open', function () {
  console.log('Mongoose is connected to mongoDB');
});

const User = require('./models/users.js');

app.get('/users', Data.getAllUsers);
app.get('/user/:id', Data.getOneUser);
app.post('/user', Data.addUser);
app.delete('/user/:id', Data.deleteUser);

app.get('/', (req, res) => {
  res.status(200).send('Welcome!');
});

app.use('*', (req, res) => {
  res.status(404).send('Could not find what you requested.');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
