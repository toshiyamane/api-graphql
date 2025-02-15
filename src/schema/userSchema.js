const { gql } = require('apollo-server');

const userSchema = gql`
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
        register(name: String!, email: String!, password: String!): User
        login(email: String!, password: String!): AuthPayload
    }

    type AuthPayload {
        token: String
        user: User
    }
`;

module.exports = userSchema;
