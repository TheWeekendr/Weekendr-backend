'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  userSub: { type: String, required: true },
  name: { type: String, required: true },
  zipCode: { type: String, required: true },
  favFoods: { type: Array, required: false },
  favActivities: { type: Array, required: false },
  priorSearches: { type: Array, required: false },
  savedActivities: { type: Array, required: false },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
