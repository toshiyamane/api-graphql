const { createUser, findUserByEmail } = require('../adapters/userRepository');
const { generateToken, hashPassword, comparePassword } = require('../config/auth');

const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error('Email já cadastrado');
  const hashedPassword = hashPassword(password);
  const user = await createUser({ name, email, password: hashedPassword });
  return generateToken(user);
};

const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user || !comparePassword(password, user.password)) {
    throw new Error('Credenciais inválidas');
  }
  return generateToken(user);
};

module.exports = { registerUser, loginUser };