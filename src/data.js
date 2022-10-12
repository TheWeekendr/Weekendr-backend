'use strict';

require('dotenv').config();
const axios = require('axios');
const UserModel = require('./models/users.js');
const cache = require('./cache.js');

const Data = {};

Data.addUser = async (req, res, next) => {
  try {
    const data = req.body;
    // const user = new UserModel(data);
    // await user.save();
    await UserModel.create(data);

    res.status(200).json(data);
  } catch (e) {
    next(e.message);
  }
};

Data.updateUser = async (req, res, next) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const options = {
      new: true,
      overwrite: true,
    };
    const updatedUser = await UserModel.findByIdAndUpdate(id, data, options);
    res.status(201).json(updatedUser);
  } catch (e) {
    next(e.message);
  }
};

Data.getAllUsers = async (req, res) => {
  const users = await UserModel.find({});
  res.status(200).json(users);
};

Data.getOneUser = async (req, res) => {
  const id = req.params.id;
  const users = await UserModel.find({ _id: id });
  res.status(200).json(users[0]);
};

Data.getOneUserByName = async (req, res, next) => {
  try {
    const name = req.params.name;
    const user = await UserModel.find({ name: name });
    res.status(200).json(user);
  } catch (e) {
    next(e.message);
  }
};

Data.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndDelete(id);
    res.status(200).send('User account deleted');
  } catch (e) {
    next(e.message);
  }
};

Data.getGoogleEvents = async (req, res, next) => {
  try {
    const key = `google-events-${req.query.searchQuery}--${req.query.location}`;

    if (cache[key] && Date.now() - cache[key].timeStamp < 86400000) {
      res.status(200).json(cache[key].data);
      console.log('Cache hit!');
    } else {
      console.log('Cache miss!');

      const searchQuery = req.query.searchQuery;
      const location = req.query.location;
      const url = `${process.env.SERPAPI_URL}/search`;
      const options = {
        engine: 'google_events',
        api_key: process.env.SERPAPI_KEY,
        q: searchQuery,
        location: location,
        htichips: 'date:week,date:next_week',
      };

      const googleData = await axios.get(url, { params: options });
      res.status(200).json(googleData.data);

      cache[key] = {
        timeStamp: Date.now(),
        data: googleData.data,
      };
    }
  } catch (e) {
    next(e.message);
  }
};

module.exports = Data;
