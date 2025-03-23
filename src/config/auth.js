const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

const generateToken = (user) => jwt.sign({ id: user.id }, SECRET, { expiresIn: '30m' });
const verifyToken = (token) => jwt.verify(token, SECRET);
const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };