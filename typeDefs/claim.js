const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    pendingClaims: [Claim!]
    count: Int!
  }

  extend type Mutation {
    claimCompany(
      user: String!
      email: String!
      name: String!
      company: ID!
    ): Claim!
    approveClaim(id: ID!): Claim!
    denyClaim(id: ID!): Claim!
  }

  type Claim {
    id: ID!
    user: String!
    email: String!
    name: String!
    company: Company!
    pending: Boolean!
    approved: Boolean!
    createdAt: String!
  }
`;
