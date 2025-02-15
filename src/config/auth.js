const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET não está definido. Verifique seu arquivo .env.");
    }
    return jwt.sign(
        { id: user.id, email: user.email },  // Garante que estamos passando `id` e `email`
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
};

const getUserFromToken = (token) => {
    if (!token) {
        console.log("Token não fornecido!");
        return null;
    }

    try {
        console.log("Token recebido:", token);
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        console.log("Usuário autenticado:", decoded);
        return decoded;
    } catch (err) {
        console.log("Erro ao verificar token:", err.message);
        return null;
    }
};

module.exports = { generateToken, getUserFromToken, bcrypt };
