const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserModel = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

const createUser = async (user) => await UserModel.create(user);
const findUserByEmail = async (email) => await UserModel.findOne({ where: { email } });

module.exports = { UserModel, createUser, findUserByEmail };