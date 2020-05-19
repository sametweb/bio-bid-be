const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    companies: [Company!]!
    company(name: String!): Company!
  }

  extend type Mutation {
    createCompany(name: String!, services: [ServiceInput]!): Company!
    updateCompany(
      updated_name: String
      updated_services: [ServiceInput]!
      name: String!
    ): Company!
    deleteCompany(name: String!): Company!
  }

  type Company {
    id: ID
    name: String!
    studies: [Study!]
    services: [Service!]
    bids: [Bid!]
  }

  input ServiceInput {
    name: String!
  }
`;
