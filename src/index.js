const { ApolloServer } = require('apollo-server');
const sequelize = require('./config/database');
const typeDefs = require('./schema/userSchema');  
const resolvers = require('./resolvers/userResolvers');
const { getUserFromToken } = require('./config/auth');

require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const context = ({ req }) => {
    const query = req.body.query || ''; // Obtém a query enviada

    console.log('Query recebida:', query);

    // Se a query contém a mutação de login, não exige token
    if (query.includes('mutation') && query.includes('login')) {
        console.log('Login detected, skipping token verification.');
        return { user: null };  // Retorna user como null, mas mantém o formato esperado
    }

    const token = req.headers.authorization || '';
    console.log('Token recebido:', token);
    if (!token) {
        throw new Error('Authorization token is required');
    }

    // Verifica a validade do token
    const user = getUserFromToken(token.replace('Bearer ', ''));
    console.log('user:', user);
    if (!user) {
        console.log('user2:', user);
        throw new Error('Unauthorized');
    }

    return { user };  // Retorna o usuário se o token for válido
};



const server = new ApolloServer({ typeDefs, resolvers, context });

sequelize.sync().then(() => {
    server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
});
