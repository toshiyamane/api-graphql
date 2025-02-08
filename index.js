const { ApolloServer, gql } = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

// Definindo o schema
const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Query {
        users: [User]
        user(id: ID!): User
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User
        updateUser(id: ID!, name: String, email: String, age: Int): User
        deleteUser(id: ID!): User
        login(email: String!, password: String!): AuthPayload
    }

    type AuthPayload {
        token: String
        user: User
    }
`;

// Dados fictícios para armazenar os usuários
let users = [
  { id: "1", name: "John Doe", email: "john@example.com", age: 30 },
  { id: "2", name: "Jane Smith", email: "jane@example.com", age: 25 }
];

let fakeUserDb = [
    { email: "john@example.com", password: "123456" },  // Senha simples para exemplo
    { email: "jane@example.com", password: "abcdef" }
  ];

// Função para gerar o JWT
const generateToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  };  

  // Função para verificar o JWT
const getUserFromToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return null;
    }
  };  

// Resolvers
const resolvers = {
  Query: {
    users: (parent, args, context) => {
        if (!context.user) throw new Error("Unauthorized");
        return users;
      },
    user: (parent, args, context) => {
        if (!context.user) throw new Error("Unauthorized");
        return users.find(user => user.id === args.id);
    }
  },
  Mutation: {
    createUser: (parent, args, context) => {
        if (!context.user) throw new Error("Unauthorized");
        const newUser = { id: `${users.length + 1}`, ...args };
        users.push(newUser);
        return newUser;
    },
    updateUser: (parent, args, context) => {
        if (!context.user) throw new Error("Unauthorized");
        let updatedUser;
        users = users.map(user => {
            if (user.id === args.id) {
            updatedUser = { ...user, ...args };
            return updatedUser;
            }
            return user;
        });
        return updatedUser;
    },
    deleteUser: (parent, args, context) => {
        if (!context.user) throw new Error("Unauthorized");
        const deletedUser = users.find(user => user.id === args.id);
        users = users.filter(user => user.id !== args.id);
        return deletedUser;
    },
    login: (parent, args) => {
        const { email, password } = args;
        const user = fakeUserDb.find(u => u.email === email && u.password === password);
        if (!user) throw new Error("Invalid credentials");

        const token = generateToken({ id: email });  // Gerar um token usando o e-mail do usuário
        return { token, user: { id: email, name: email.split('@')[0], email } };
    }
  }
};

// Middlewares de contexto
const context = ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token.replace('Bearer ', ''));
    return { user };
  };
  
  // Criando o servidor Apollo
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });
  
  // Iniciando o servidor
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });