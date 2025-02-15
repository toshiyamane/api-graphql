const User = require('../models/User');
const { generateToken, bcrypt } = require('../config/auth');

const resolvers = {
    Query: {
        users: (parent, args, context) => {
            console.log("Usuário context:", context.user);
            if (!context.user) throw new Error("Unauthorized");  // Verifica se o usuário está autenticado
            return User.findAll();
        },
        user: (parent, args, context) => {
            console.log("Usuário context:", context.user);
            if (!context.user) throw new Error("Unauthorized");  // Verifica se o usuário está autenticado
            return User.findByPk(args.id);
        }
    },
    Mutation: {
        register: async (parent, args, context) => {
            console.log("Usuário context:", context.user);
            if (!context.user) throw new Error("Unauthorized");
            return await User.create(args);
          },
        login: (parent, args) => {
            const { email, password } = args;
        
            const user = fakeUserDb.find(u => u.email === email && u.password === password);
            if (!user) {
                throw new Error("Credenciais inválidas");  // Mensagem mais clara
            }
        
            // Criamos um ID fictício, já que fakeUserDb não tem um `id`
            const userData = {
                id: Math.random().toString(36).substring(7), // Gera um ID aleatório para testes
                name: email.split('@')[0], // Pega o nome do email
                email
            };
        
            const token = generateToken(userData);
        
            return { token, user: userData };
        }
        
    }
};

module.exports = resolvers;

const fakeUserDb = [
    { id: "1", email: "admin", password: "admin" }
];