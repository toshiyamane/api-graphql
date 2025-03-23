const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    login(email: String!, password: String!): AuthPayload!
    me: User!  # Private
    getUserById(id: ID!): User!  # Private
    getAllUsers: [User!]!  # Private
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!  # Public
    deleteUser(id: ID!): String!  # Private
  }
`;

module.exports = typeDefs;