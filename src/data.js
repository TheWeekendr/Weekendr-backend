'use strict';

const UserModel = require('./models/users.js');

const Data = {};

Data.addUser = async (req, res, next) => {
  try {
    const data = req.body;
    const user = new UserModel(data);
    await user.save();
    res.status(200).json(item);
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

Data.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndDelete(id);
    res.status(200).send('User account deleted');
  } catch (e) {
    next(e.message);
  }
};

Data.seed = async () => {
  console.log('seeding users...');
  await UserModel.create({
    name: 'Bob',
    zipCode: '55555',
    favFoods: ['chinese', 'italian'],
  });
};

module.exports = Data;
