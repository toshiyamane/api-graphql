const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas/userSchema');
const resolvers = require('./resolvers/userResolvers');
const sequelize = require('./config/database');
const { verifyToken } = require('./config/auth');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (token) {
      try {
        const user = verifyToken(token);
        return { user };
      } catch (err) {
        throw new Error('Token inválido ou expirado');
      }
    }

    return {};
  }
});

sequelize.sync().then(() => {
  server.listen().then(({ url }) => {
    console.log(`Servidor rodando em ${url}`);
  });
});
