const { registerUser, loginUser } = require('../usecases/userUseCases');
const { UserModel } = require('../adapters/userRepository');

const resolvers = {
    Query: {
      login: async (_, { email, password }) => {
        const token = await loginUser({ email, password });
        return { token };
      },
      me: async (_, __, context) => {
        if (!context.user) throw new Error('Não autenticado');
  
        const user = await UserModel.findByPk(context.user.id);
        if (!user) throw new Error('Usuário não encontrado');
  
        return user;
      },
      getUserById: async (_, { id }, context) => {
        if (!context.user) throw new Error('Não autenticado');
  
        const user = await UserModel.findByPk(id);
        if (!user) throw new Error('Usuário não encontrado');
  
        return user;
      },
      getAllUsers: async (_, __, context) => {
        if (!context.user) throw new Error('Não autenticado');
  
        return await UserModel.findAll();
      }
    },
    Mutation: {
      register: async (_, { name, email, password }) => {
        const token = await registerUser({ name, email, password });
        return { token };
      },
      deleteUser: async (_, { id }, context) => {
        if (!context.user) throw new Error('Não autenticado');
  
        const user = await UserModel.findByPk(id);
        if (!user) throw new Error('Usuário não encontrado');
  
        await user.destroy();
        return "Usuário deletado com sucesso.";
      }
    }
  };
  
  module.exports = resolvers;